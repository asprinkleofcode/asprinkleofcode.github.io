import { useEffect } from "react";

export interface DocumentMeta {
  title: string;
  description: string;
  /** Structured data for this route, added as its own JSON-LD script. */
  jsonLd?: Record<string, unknown>;
}

/** Marks the JSON-LD script this hook adds, so cleanup never touches the static ones. */
export const DOCUMENT_META_ATTRIBUTE = "data-document-meta";

/**
 * Per-route head metadata as progressive enhancement (AD-14). The static
 * `index.html` head stays the owner of identity wording; this sets the tab
 * title, the description and optional JSON-LD while the route is mounted, and
 * on unmount restores the values it found and removes only its own script, so
 * nothing leaks across navigation.
 */
export function useDocumentMeta({ title, description, jsonLd }: DocumentMeta): void {
  // Serialized so a fresh object literal each render doesn't re-run the effect.
  const json = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    let descriptionMeta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionMeta?.content;
    const createdDescription = !descriptionMeta;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.name = "description";
      document.head.append(descriptionMeta);
    }

    document.title = title;
    descriptionMeta.content = description;

    let script: HTMLScriptElement | undefined;
    if (json) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute(DOCUMENT_META_ATTRIBUTE, "");
      script.textContent = json;
      document.head.append(script);
    }

    return () => {
      document.title = previousTitle;
      if (createdDescription) descriptionMeta.remove();
      else descriptionMeta.content = previousDescription ?? "";
      script?.remove();
    };
  }, [title, description, json]);
}
