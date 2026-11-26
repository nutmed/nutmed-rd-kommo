export type Source = "Site" | "Leadster" | "Landing Page" | "Meta Ads" | "WhatsApp" | "RD Station";

export type ProductRoute = {
  product: string;
  source: Source;
  pipelineName: string;
  stageName: string;
  tags: string[];
  responsibleUserId?: number;
};

// Confirmados: Funil NutMed → NOVOS LEADS RD. TODO NUTMED: responsável (opcional).
const pipelineName = process.env.KOMMO_PIPELINE_NAME || "Funil NutMed";
const stageName = process.env.KOMMO_ENTRY_STAGE_NAME || "NOVOS LEADS RD";
const responsibleUserId = positiveInteger(process.env.KOMMO_RESPONSIBLE_USER_ID || "");

// TODO NUTMED: cadastrar aqui os identificadores reais das conversões do RD.
// A chave é o event_identifier do RD ou o nome da rota usado em
// /api/webhooks/rd/<rota>/<segredo> nas automações.
// LP de curso: o nome do curso vira o campo Curso e a única tag (sem tags RD/LP, pedido do Rodrigo).
function lpRoute(product: string): ProductRoute {
  return { product, source: "Landing Page", pipelineName, stageName, tags: [product] };
}

export const productRoutes: Record<string, ProductRoute> = {
  "nutmed-geral": {
    product: "NUTMED",
    source: "RD Station",
    pipelineName,
    stageName,
    tags: ["RD", "NUTMED"],
  },
  // Rotas usadas na URL do webhook das automações do RD (/api/webhooks/rd/<rota>/<segredo>).
  "lp-pos-nutricao-de-precisao": lpRoute("Pós Nutrição de Precisão Funcional e Fitoterapia"),
  "lp-pos-nutricao-clinica": lpRoute("Pós Nutrição Clínica Ambulatorial e Hospitalar"),
  "lp-pos-nutricao-esportiva": lpRoute("Pós Nutrição Esportiva"),
  "lp-pos-nutricao-materno-infantil": lpRoute("Pós Nutrição Materno Infantil"),
  "lp-pos-nutricao-oncologia": lpRoute("Pós Nutrição em Oncologia"),
  // Mesmos cursos pelo identificador da conversão no RD (webhook padrão de conversão).
  "Pós Nutrição de Precisão Funcional e Fitoterapia": lpRoute("Pós Nutrição de Precisão Funcional e Fitoterapia"),
  "Pós Nutrição Clínica Ambulatorial e Hospitalar": lpRoute("Pós Nutrição Clínica Ambulatorial e Hospitalar"),
  "Pós Nutrição Esportiva": lpRoute("Pós Nutrição Esportiva"),
  "Pós Nutrição Materno Infantil": lpRoute("Pós Nutrição Materno Infantil"),
  "Pós Nutrição em Oncologia": lpRoute("Pós Nutrição em Oncologia"),
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
