export type Source = "Site" | "Leadster" | "Landing Page" | "Meta Ads" | "WhatsApp" | "RD Station";

export type ProductRoute = {
  product: string;
  source: Source;
  pipelineName: string;
  stageName: string;
  tags: string[];
  responsibleUserId?: number;
};

// TODO NUTMED: confirmar nome do funil, etapa de entrada e responsável.
const pipelineName = process.env.KOMMO_PIPELINE_NAME || "Funil NUTMED";
const stageName = process.env.KOMMO_ENTRY_STAGE_NAME || "NOVOS LEADS RD";
const responsibleUserId = positiveInteger(process.env.KOMMO_RESPONSIBLE_USER_ID || "");

// TODO NUTMED: cadastrar aqui os identificadores reais das conversões do RD.
// A chave é o event_identifier do RD ou o nome da rota usado em
// /api/webhooks/rd/<rota>/<segredo> nas automações.
export const productRoutes: Record<string, ProductRoute> = {
  "nutmed-geral": {
    product: "NUTMED",
    source: "RD Station",
    pipelineName,
    stageName,
    tags: ["RD", "NUTMED"],
  },
};

export function routeForEvent(eventIdentifier: string): ProductRoute | undefined {
  const route = productRoutes[eventIdentifier.trim()];
  if (!route) return undefined;
  return { ...route, responsibleUserId: route.responsibleUserId ?? responsibleUserId };
}

function positiveInteger(value: string): number | undefined {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
