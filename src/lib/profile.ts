import type { KommoCustomField, KommoFieldValue } from "@/lib/kommo-types";
import { normalizeText } from "@/lib/normalize";

// A LP envia o "Você é" ao RD apenas como tag perfil-<valor>.
export const profileLabels: Record<string, string> = {
  nutricionista: "Nutricionista formada(o)",
  formando: "Formando(a) em Nutrição",
  estudante: "Estudante de Nutrição",
};

const profileFieldNames = ["Você é", "Você é?", "Perfil"];

export type Profile = { slug: string; label: string };

export function profileFromTags(tags: unknown): Profile | undefined {
  if (!Array.isArray(tags)) return undefined;
  for (const tag of tags) {
    const match = /^perfil-(.+)$/i.exec(String(tag ?? "").trim());
    if (!match) continue;
    const slug = match[1].toLowerCase();
    return { slug, label: profileLabels[slug] ?? slug };
  }
  return undefined;
}

export function findProfileField(fields: KommoCustomField[]): KommoCustomField | undefined {
  const names = profileFieldNames.map(normalizeText);
  return fields.find((field) => names.includes(normalizeText(field.name)));
}

export function profileFieldValue(field: KommoCustomField, profile: Profile): KommoFieldValue | undefined {
  if (["select", "radiobutton", "multiselect"].includes(field.type)) {
    const label = normalizeText(profile.label);
    const stem = normalizeText(profile.slug).slice(0, 6);
    const option = field.enums?.find((item) => normalizeText(item.value) === label)
      ?? field.enums?.find((item) => normalizeText(item.value) === normalizeText(profile.slug))
      ?? field.enums?.find((item) => normalizeText(item.value).includes(stem));
    if (!option) return undefined;
    return { field_id: field.id, values: [{ value: option.value, enum_id: option.id }] };
  }
  return { field_id: field.id, values: [{ value: profile.label }] };
}
