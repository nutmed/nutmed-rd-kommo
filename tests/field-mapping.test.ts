import { describe, expect, it } from "vitest";
import { buildLeadCustomFields, buildNamedCustomFields } from "../src/lib/field-mapping";

describe("mapeamento dos campos da oportunidade", () => {
  it("mapeia campos do RD para campos de mesmo nome na Kommo", () => {
    const result = buildLeadCustomFields([
      { id: 10, name: "Mensagem", type: "textarea" },
      { id: 11, name: "UTM_SOURCE", type: "text" },
      {
        id: 12,
        name: "Interesse",
        type: "select",
        enums: [{ id: 1, value: "Consulta" }, { id: 2, value: "Exame" }],
      },
    ], {
      product: "NUTMED",
      source: "RD Station",
      event: "nutmed-geral",
      utmSource: "google",
      custom: { cf_mensagem: "Quero agendar", Interesse: "exame" },
    });

    expect(result.fields).toContainEqual({ field_id: 10, values: [{ value: "Quero agendar" }] });
    expect(result.fields).toContainEqual({ field_id: 11, values: [{ value: "google" }] });
    expect(result.fields).toContainEqual({ field_id: 12, values: [{ value: "Exame", enum_id: 2 }] });
  });

  it("gera aviso sem bloquear quando o campo não existe na Kommo", () => {
    const result = buildLeadCustomFields([], {
      product: "NUTMED",
      source: "RD Station",
      event: "nutmed-geral",
      custom: { cf_campo_inexistente: "x" },
    });
    expect(result.fields).toEqual([]);
    expect(result.warnings).toContain("Campo RD sem correspondente na Kommo: cf_campo_inexistente");
  });

  it("mapeia campos nomeados", () => {
    const result = buildNamedCustomFields([{ id: 1, name: "Cidade", type: "text" }], [
      { names: ["Cidade"], value: "Curitiba" },
    ]);
    expect(result.fields).toEqual([{ field_id: 1, values: [{ value: "Curitiba" }] }]);
  });
});
