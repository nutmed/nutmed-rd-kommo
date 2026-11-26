import { normalizeText } from "@/lib/normalize";

// Divisão dos novos leads entre vendedores, por porcentagem.
// Formato: "Nome:peso,Nome:peso". Pode ser trocado pela variável KOMMO_DISTRIBUTION.
export const defaultDistribution = "Darlene:43,Fernando:43,Bárbara:14";

export type DistributionEntry = { name: string; weight: number };
export type KommoUserSummary = { id: number; name: string; active?: boolean };

export function parseDistribution(value = process.env.KOMMO_DISTRIBUTION || defaultDistribution): DistributionEntry[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, weight] = part.split(":");
      return { name: (name ?? "").trim(), weight: Number(String(weight ?? "").replace(",", ".")) };
    })
    .filter((entry) => entry.name && Number.isFinite(entry.weight) && entry.weight > 0);
}

// Número estável de 0 a 99 a partir do contato: o mesmo lead sempre cai na mesma pessoa,
// mesmo se o RD reenviar a conversão.
export function bucketFor(key: string): number {
  let hash = 2166136261;
  for (const char of key) {
    hash ^= char.codePointAt(0)!;
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash % 10000 / 100;
}

export function pickByWeight<T extends { weight: number }>(entries: T[], bucket: number): T | undefined {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (!total) return undefined;
  const target = (bucket / 100) * total;
  let cumulative = 0;
  for (const entry of entries) {
    cumulative += entry.weight;
    if (target < cumulative) return entry;
  }
  return entries[entries.length - 1];
}

export function matchUser(users: KommoUserSummary[], name: string): KommoUserSummary | undefined {
  const wanted = normalizeText(name);
  const active = users.filter((user) => user.active !== false);
  return active.find((user) => normalizeText(user.name) === wanted)
    ?? active.find((user) => normalizeText(user.name).split(" ")[0] === wanted.split(" ")[0]);
}

// Se o contato já é de um dos vendedores da divisão, o lead novo fica com ele (pedido do Rodrigo, 26/11/2026).
export function chooseResponsible(
  users: KommoUserSummary[],
  contactKey: string,
  entries = parseDistribution(),
  currentOwnerId?: number,
) {
  const resolved = entries
    .map((entry) => ({ ...entry, user: matchUser(users, entry.name) }))
    .filter((entry): entry is DistributionEntry & { user: KommoUserSummary } => Boolean(entry.user));
  const missing = entries.filter((entry) => !resolved.some((item) => item.name === entry.name)).map((entry) => entry.name);
  const owner = currentOwnerId ? resolved.find((entry) => entry.user.id === currentOwnerId) : undefined;
  if (owner) return { user: owner.user, missing, kept: true };
  const chosen = pickByWeight(resolved, bucketFor(contactKey));
  return { user: chosen?.user, missing, kept: false };
}
