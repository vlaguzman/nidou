import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { communityIntro } from "@/data/communityIntro";
import { CommunityIntro } from "./CommunityIntro";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("CommunityIntro", () => {
  it("renders the logo inline with the statement", () => {
    render(<CommunityIntro />);
    expect(screen.getByAltText(communityIntro.logo.alt)).toBeInTheDocument();
    expect(screen.getByText(communityIntro.statement, { exact: false })).toBeInTheDocument();
  });

  it("renders the supporting copy", () => {
    render(<CommunityIntro />);
    expect(screen.getByText(communityIntro.supporting)).toBeInTheDocument();
  });
});
