import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { DOCUMENT_META_ATTRIBUTE, useDocumentMeta, type DocumentMeta } from "./useDocumentMeta";

const STATIC_TITLE = "Static title";
const STATIC_DESCRIPTION = "Static description.";
const STATIC_JSON_LD = '{"@type":"Person"}';

function description(): string | null | undefined {
  return document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content;
}

function jsonLdScripts(): string[] {
  return [...document.head.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? "");
}

describe("useDocumentMeta", () => {
  beforeEach(() => {
    document.head.innerHTML = `<meta name="description" content="${STATIC_DESCRIPTION}"><script type="application/ld+json">${STATIC_JSON_LD}</script>`;
    document.title = STATIC_TITLE;
  });

  afterEach(() => {
    document.head.innerHTML = "";
  });

  const meta: DocumentMeta = {
    title: "Story | Site",
    description: "Story summary.",
    jsonLd: { "@type": "Article", headline: "Story" },
  };

  it("applies the title, description and JSON-LD", () => {
    renderHook(() => useDocumentMeta(meta));
    expect(document.title).toBe("Story | Site");
    expect(description()).toBe("Story summary.");
    expect(jsonLdScripts()).toEqual([STATIC_JSON_LD, '{"@type":"Article","headline":"Story"}']);
    expect(document.head.querySelectorAll(`[${DOCUMENT_META_ATTRIBUTE}]`)).toHaveLength(1);
  });

  it("restores the static head and removes only its own script on unmount", () => {
    const { unmount } = renderHook(() => useDocumentMeta(meta));
    unmount();
    expect(document.title).toBe(STATIC_TITLE);
    expect(description()).toBe(STATIC_DESCRIPTION);
    expect(jsonLdScripts()).toEqual([STATIC_JSON_LD]);
  });

  it("adds no script without jsonLd", () => {
    renderHook(() => useDocumentMeta({ title: "T", description: "D" }));
    expect(jsonLdScripts()).toEqual([STATIC_JSON_LD]);
  });

  it("replaces, not stacks, its values when they change", () => {
    const { rerender, unmount } = renderHook((props: DocumentMeta) => useDocumentMeta(props), { initialProps: meta });
    rerender({ title: "Other | Site", description: "Other.", jsonLd: { "@type": "Article", headline: "Other" } });
    expect(document.title).toBe("Other | Site");
    expect(description()).toBe("Other.");
    expect(jsonLdScripts()).toEqual([STATIC_JSON_LD, '{"@type":"Article","headline":"Other"}']);
    unmount();
    expect(document.title).toBe(STATIC_TITLE);
    expect(description()).toBe(STATIC_DESCRIPTION);
    expect(jsonLdScripts()).toEqual([STATIC_JSON_LD]);
  });

  it("does not re-run for an equal jsonLd object on rerender", () => {
    const { rerender } = renderHook((props: DocumentMeta) => useDocumentMeta(props), { initialProps: meta });
    const script = document.head.querySelector(`[${DOCUMENT_META_ATTRIBUTE}]`);
    rerender({ ...meta, jsonLd: { ...meta.jsonLd } });
    expect(document.head.querySelector(`[${DOCUMENT_META_ATTRIBUTE}]`)).toBe(script);
  });

  it("creates a description meta when the head has none, and removes it again", () => {
    document.head.innerHTML = "";
    const { unmount } = renderHook(() => useDocumentMeta(meta));
    expect(description()).toBe("Story summary.");
    unmount();
    expect(document.head.querySelector('meta[name="description"]')).toBeNull();
  });
});
