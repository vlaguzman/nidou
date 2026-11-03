import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FinalCta } from "./FinalCta";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("FinalCta", () => {
  it("renders the heading and the email form", () => {
    const { container } = render(<FinalCta />);
    expect(screen.getByRole("heading", { name: "Tu refugio también puede empezar aquí." })).toBeInTheDocument();
    expect(screen.getByLabelText("Tu correo electrónico")).toBeRequired();
    expect(screen.getByRole("button", { name: "Únete a la comunidad" })).toHaveAttribute("type", "submit");
    expect(container.querySelector("section#unete")).not.toBeNull();
  });

  it("shows the thank-you message after submitting an email", () => {
    render(<FinalCta />);
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "ana@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.getByText(/Gracias por tu interés/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Tu correo electrónico")).toBeNull();
  });

  it("ignores a blank submission", () => {
    render(<FinalCta />);
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.queryByText(/Gracias por tu interés/)).toBeNull();
  });

  it("asks the browser for email autofill", () => {
    render(<FinalCta />);
    const input = screen.getByLabelText("Tu correo electrónico");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("renders an empty polite live region before submit and fills it on submit", () => {
    render(<FinalCta />);
    const region = screen.getByRole("status");
    expect(region).toBeEmptyDOMElement();
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "ana@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.getByRole("status")).toBe(region);
    expect(region).toHaveTextContent(/Gracias por tu interés/);
  });

  it("moves focus to the confirmation message after submit", () => {
    render(<FinalCta />);
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "ana@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.getByRole("status")).toHaveFocus();
  });
});
