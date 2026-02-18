// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { mountRot13Reveal, rot13 } from "../src/index";

describe("rot13", () => {
  it("transforms lowercase correctly", () => {
    expect(rot13("hello")).toBe("uryyb");
  });

  it("transforms uppercase correctly", () => {
    expect(rot13("HELLO")).toBe("URYYB");
  });

  it("is symmetric", () => {
    const original = "breuer.marcel@outlook.com";
    expect(rot13(rot13(original))).toBe(original);
  });

  it("preserves non-letters", () => {
    expect(rot13("123-_=!")).toBe("123-_=!");
  });
});

describe("mountRot13Reveal", () => {
  it("renders controls and reveals plaintext on click", async () => {
    const container = document.createElement("div");
    const { destroy } = mountRot13Reveal(container, "mail@example.com", {
      revealDelayMs: 0,
    });

    const button = container.querySelector("button");
    const output = container.querySelector("span");

    expect(button).not.toBeNull();
    expect(output).not.toBeNull();
    expect(button?.dataset.rot13).toBe(rot13("mail@example.com"));

    button?.click();
    await Promise.resolve();

    expect(button?.disabled).toBe(true);
    expect(button?.textContent).toBe("Revealed");
    expect(button?.dataset.rot13).toBeUndefined();
    expect(output?.textContent).toBe("mail@example.com");

    destroy();
    expect(container.textContent).toBe("");
  });

  it("creates a mailto link when enabled", async () => {
    const container = document.createElement("div");
    mountRot13Reveal(container, "mail@example.com", {
      revealDelayMs: 0,
      mailtoAfterReveal: true,
    });

    const button = container.querySelector("button");
    button?.click();
    await Promise.resolve();

    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("mailto:mail@example.com");
    expect(link?.textContent).toBe("mail@example.com");
  });

  it("uses the configured reveal delay", async () => {
    const container = document.createElement("div");
    vi.useFakeTimers();
    mountRot13Reveal(container, "delay@example.com", { revealDelayMs: 250 });

    const button = container.querySelector("button");
    const output = container.querySelector("span");
    button?.click();

    expect(output?.textContent).toBe("");
    await vi.advanceTimersByTimeAsync(250);
    expect(output?.textContent).toBe("delay@example.com");
    vi.useRealTimers();
  });

  it("blocks context menu when enabled", () => {
    const container = document.createElement("div");
    mountRot13Reveal(container, "mail@example.com", { blockContextMenu: true });

    const event = new MouseEvent("contextmenu", { cancelable: true });
    container.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("restores container styles on destroy", () => {
    const container = document.createElement("div");
    container.style.userSelect = "text";
    container.style.webkitUserSelect = "text";
    container.style.cursor = "pointer";

    const { destroy } = mountRot13Reveal(container, "mail@example.com", {
      hardenUi: true,
      revealDelayMs: 0,
    });

    expect(container.style.userSelect).toBe("none");
    expect(container.style.webkitUserSelect).toBe("none");
    expect(container.style.cursor).toBe("default");

    destroy();

    expect(container.style.userSelect).toBe("text");
    expect(container.style.webkitUserSelect).toBe("text");
    expect(container.style.cursor).toBe("pointer");
  });
});
