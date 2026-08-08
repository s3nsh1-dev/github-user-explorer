import { describe, expect, it } from "vitest";
import { toExternalUrl } from "./externalUrl";

describe("toExternalUrl", () => {
  it("passes a full URL through", () => {
    expect(toExternalUrl("https://example.com/blog")).toBe(
      "https://example.com/blog"
    );
    expect(toExternalUrl("http://example.com")).toBe("http://example.com/");
  });

  it("assumes https when the scheme is missing", () => {
    expect(toExternalUrl("example.com")).toBe("https://example.com/");
    expect(toExternalUrl("www.example.com/x")).toBe("https://www.example.com/x");
  });

  it("trims", () => {
    expect(toExternalUrl("  example.com  ")).toBe("https://example.com/");
  });

  /**
   * The reason this helper exists. `blog` is typed by the profile owner, so an
   * href built from it straight is stored XSS with a third party supplying the
   * payload.
   */
  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
  ])("refuses %s", (value) => expect(toExternalUrl(value)).toBeNull());

  it.each(["", "   ", "https://", "http://"])(
    "returns null for %s",
    (value) => expect(toExternalUrl(value)).toBeNull()
  );

  it("returns null for a missing value", () => {
    expect(toExternalUrl(null)).toBeNull();
    expect(toExternalUrl(undefined)).toBeNull();
  });
});
