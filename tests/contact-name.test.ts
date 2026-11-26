import { describe, expect, it } from "vitest";
import { contactNameFields } from "../src/lib/kommo";

describe("nome do contato", () => {
  it("separa primeiro nome e sobrenome", () => {
    expect(contactNameFields("  Ana   Paula Souza ")).toEqual({ name: "Ana Paula Souza", first_name: "Ana", last_name: "Paula Souza" });
  });

  it("aceita nome sem sobrenome", () => {
    expect(contactNameFields("Juliana")).toEqual({ name: "Juliana", first_name: "Juliana", last_name: "" });
  });
});
