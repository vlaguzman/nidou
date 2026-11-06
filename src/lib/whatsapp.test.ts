import { describe, expect, it } from "vitest";
import { whatsappHref } from "./whatsapp";

describe("whatsappHref", () => {
  it("builds a wa.me link from an international number with spaces and a plus", () => {
    expect(whatsappHref("+44 7950 745207", "Hola")).toBe("https://wa.me/447950745207?text=Hola");
  });

  it("URI-encodes the message", () => {
    expect(whatsappHref("447950745207", "Mi correo es ana+1@example.com")).toBe(
      "https://wa.me/447950745207?text=Mi%20correo%20es%20ana%2B1%40example.com",
    );
  });
});
