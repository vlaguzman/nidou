import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FinalCta } from "./FinalCta";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("FinalCta", () => {
  it("renders the heading and the email form", () => {
    const { container } = render(<FinalCta lang="es" />);
    expect(screen.getByRole("heading", { name: "Tu refugio también puede empezar aquí." })).toBeInTheDocument();
    expect(screen.getByLabelText("Tu correo electrónico")).toBeRequired();
    expect(screen.getByRole("button", { name: "Únete a la comunidad" })).toHaveAttribute("type", "submit");
    expect(container.querySelector("section#unete")).not.toBeNull();
  });

  it("shows the thank-you message after submitting an email", () => {
    render(<FinalCta lang="es" />);
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "ana@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.getByText(/Gracias por tu interés/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Tu correo electrónico")).toBeNull();
  });

  it("ignores a blank submission", () => {
    render(<FinalCta lang="es" />);
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.queryByText(/Gracias por tu interés/)).toBeNull();
  });

  it("asks the browser for email autofill", () => {
    render(<FinalCta lang="es" />);
    const input = screen.getByLabelText("Tu correo electrónico");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("renders an empty polite live region before submit and fills it on submit", () => {
    render(<FinalCta lang="es" />);
    const region = screen.getByRole("status");
    expect(region).toBeEmptyDOMElement();
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "ana@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.getByRole("status")).toBe(region);
    expect(region).toHaveTextContent(/Gracias por tu interés/);
  });

  it("moves focus to the confirmation message after submit", () => {
    render(<FinalCta lang="es" />);
    fireEvent.change(screen.getByLabelText("Tu correo electrónico"), { target: { value: "ana@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Únete a la comunidad" }).closest("form")!);
    expect(screen.getByRole("status")).toHaveFocus();
  });
});

describe("FinalCta in English", () => {
  it("renders the English copy and confirmation", () => {
    render(<FinalCta lang="en" />);
    expect(screen.getByRole("heading", { name: "Your refuge can begin right here, too." })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Your email address"), { target: { value: "ana@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Join the community" }).closest("form")!);
    expect(screen.getByText(/Thank you for your interest/)).toBeInTheDocument();
  });

  it("keeps the same section anchor in both locales", () => {
    const { container } = render(<FinalCta lang="en" />);
    expect(container.querySelector("section#unete")).not.toBeNull();
  });
});
