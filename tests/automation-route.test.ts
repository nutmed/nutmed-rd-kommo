import { describe, expect, it } from "vitest";
import { routeForEvent } from "../src/config/products";

describe("rotas da NUTMED", () => {
  it("envia a rota geral para o funil e a etapa de entrada da NUTMED", () => {
    expect(routeForEvent("nutmed-geral")).toMatchObject({
      product: "NUTMED",
      source: "RD Station",
      pipelineName: "Funil NutMed",
      stageName: "NOVOS LEADS RD",
      tags: ["RD", "NUTMED"],
    });
  });

  it.each([
    ["lp-pos-nutricao-de-precisao", "Pós Nutrição de Precisão Funcional e Fitoterapia"],
    ["lp-pos-nutricao-clinica", "Pós Nutrição Clínica Ambulatorial e Hospitalar"],
    ["lp-pos-nutricao-esportiva", "Pós Nutrição Esportiva"],
    ["lp-pos-nutricao-materno-infantil", "Pós Nutrição Materno Infantil"],
    ["lp-pos-nutricao-oncologia", "Pós Nutrição em Oncologia"],
    ["Pós Nutrição de Precisão Funcional e Fitoterapia", "Pós Nutrição de Precisão Funcional e Fitoterapia"],
    ["Pós Nutrição Clínica Ambulatorial e Hospitalar", "Pós Nutrição Clínica Ambulatorial e Hospitalar"],
    ["Pós Nutrição Esportiva", "Pós Nutrição Esportiva"],
    ["Pós Nutrição Materno Infantil", "Pós Nutrição Materno Infantil"],
    ["Pós Nutrição em Oncologia", "Pós Nutrição em Oncologia"],
  ])("envia %s para o Funil NutMed como %s", (event, product) => {
    expect(routeForEvent(event)).toMatchObject({
      product,
      source: "Landing Page",
      pipelineName: "Funil NutMed",
      stageName: "NOVOS LEADS RD",
      tags: [product],
    });
  });

  it("ignora eventos não cadastrados", () => {
    expect(routeForEvent("[FORM] - Totem de Autoatendimento")).toBeUndefined();
  });
});
