import { describe, expect, it } from "vitest";
import { bucketFor, chooseResponsible, matchUser, parseDistribution, pickByWeight } from "../src/lib/distribution";

const users = [
  { id: 1, name: "Darlene Souza", active: true },
  { id: 2, name: "Fernando Lima", active: true },
  { id: 3, name: "Barbara Costa", active: true },
  { id: 4, name: "Fernanda Antiga", active: false },
];

describe("divisão dos leads por porcentagem", () => {
  it("lê a divisão padrão 43/43/14", () => {
    expect(parseDistribution()).toEqual([
      { name: "Darlene", weight: 43 },
      { name: "Fernando", weight: 43 },
      { name: "Bárbara", weight: 14 },
    ]);
  });

  it("encontra os usuários pelo primeiro nome, sem acento", () => {
    expect(matchUser(users, "Bárbara")?.id).toBe(3);
    expect(matchUser(users, "Fernando")?.id).toBe(2);
  });

  it("escolhe pela faixa de porcentagem", () => {
    const entries = parseDistribution();
    expect(pickByWeight(entries, 10)?.name).toBe("Darlene");
    expect(pickByWeight(entries, 50)?.name).toBe("Fernando");
    expect(pickByWeight(entries, 90)?.name).toBe("Bárbara");
  });

  it("mantém o mesmo vendedor para o mesmo contato", () => {
    expect(bucketFor("+5541999990000")).toBe(bucketFor("+5541999990000"));
  });

  it("chega perto de 43/43/14 em muitos leads", () => {
    const count: Record<number, number> = {};
    for (let i = 0; i < 10000; i += 1) {
      const id = chooseResponsible(users, `+55419${String(10000000 + i * 7919)}`).user!.id;
      count[id] = (count[id] ?? 0) + 1;
    }
    expect(count[1] / 10000).toBeGreaterThan(0.40);
    expect(count[1] / 10000).toBeLessThan(0.46);
    expect(count[2] / 10000).toBeGreaterThan(0.40);
    expect(count[2] / 10000).toBeLessThan(0.46);
    expect(count[3] / 10000).toBeGreaterThan(0.11);
    expect(count[3] / 10000).toBeLessThan(0.17);
  });

  it("mantém o vendedor que já atende o contato", () => {
    for (const owner of [1, 2, 3]) {
      for (let i = 0; i < 50; i += 1) {
        const result = chooseResponsible(users, `+5541${i}`, undefined, owner);
        expect(result.user!.id).toBe(owner);
        expect(result.kept).toBe(true);
      }
    }
  });

  it("sorteia quando o dono do contato não está na divisão", () => {
    const result = chooseResponsible(users, "+5541999", undefined, 99);
    expect(result.kept).toBe(false);
    expect([1, 2, 3]).toContain(result.user!.id);
  });

  it("avisa quando um nome não existe na Kommo", () => {
    expect(chooseResponsible(users.slice(0, 2), "x").missing).toEqual(["Bárbara"]);
  });
});
