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

  it("envia a LP da Pós Nutrição de Precisão para o Funil NutMed", () => {
    expect(routeForEvent("lp-pos-nutricao-de-precisao")).toMatchObject({
      product: "Pós Nutrição de Precisão",
      source: "Landing Page",
      pipelineName: "Funil NutMed",
      stageName: "NOVOS LEADS RD",
      tags: ["Pós Nutrição de Precisão"],
    });
  });

  it("ignora eventos não cadastrados", () => {
    expect(routeForEvent("[FORM] - Totem de Autoatendimento")).toBeUndefined();
  });
});
