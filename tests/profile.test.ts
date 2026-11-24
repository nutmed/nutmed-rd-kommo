import { describe, expect, it } from "vitest";
import { findProfileField, profileFieldValue, profileFromTags } from "../src/lib/profile";
import { parseRdWebhook } from "../src/lib/rd";

describe("campo Você é a partir da tag perfil-", () => {
  it("lê a tag enviada pela LP", () => {
    expect(profileFromTags(["lp", "pos-nutricao-de-precisao", "perfil-formando", "black-nutmed-2026"]))
      .toEqual({ slug: "formando", label: "Formando(a) em Nutrição" });
    expect(profileFromTags(["lp"])).toBeUndefined();
  });

  it("guarda as tags do contato do RD", () => {
    const parsed = parseRdWebhook({
      event_identifier: "lp-pos-nutricao-de-precisao",
      contact: { name: "Teste", email: "t@x.com", tags: ["perfil-estudante"] },
    });
    expect(parsed.tags).toEqual(["perfil-estudante"]);
  });

  it("escolhe a opção da lista na Kommo", () => {
    const field = findProfileField([
      { id: 1, name: "Outro", type: "text" },
      {
        id: 2,
        name: "Você é?",
        type: "select",
        enums: [
          { id: 10, value: "Nutricionista" },
          { id: 11, value: "Formando" },
          { id: 12, value: "Estudante" },
        ],
      },
    ]);
    expect(field?.id).toBe(2);
    expect(profileFieldValue(field!, { slug: "formando", label: "Formando(a) em Nutrição" }))
      .toEqual({ field_id: 2, values: [{ value: "Formando", enum_id: 11 }] });
  });

  it("grava o texto quando o campo é livre", () => {
    expect(profileFieldValue({ id: 3, name: "Você é", type: "text" }, { slug: "nutricionista", label: "Nutricionista formada(o)" }))
      .toEqual({ field_id: 3, values: [{ value: "Nutricionista formada(o)" }] });
  });
});
