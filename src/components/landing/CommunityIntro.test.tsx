import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCommunityIntro } from "@/data/communityIntro";
import { CommunityIntro } from "./CommunityIntro";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

const communityIntro = getCommunityIntro("es");

describe("CommunityIntro", () => {
  it("renders the logo inline with the statement", () => {
    render(<CommunityIntro lang="es" />);
    expect(screen.getByAltText(communityIntro.logo.alt)).toBeInTheDocument();
    expect(screen.getByText(communityIntro.statement, { exact: false })).toBeInTheDocument();
  });

  it("renders the supporting copy", () => {
    render(<CommunityIntro lang="es" />);
    expect(screen.getByText(communityIntro.supporting)).toBeInTheDocument();
  });
});

describe("CommunityIntro in English", () => {
  it("renders the English statement and supporting copy", () => {
    const en = getCommunityIntro("en");
    render(<CommunityIntro lang="en" />);
    expect(screen.getByText(en.statement, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(en.supporting)).toBeInTheDocument();
  });
});
