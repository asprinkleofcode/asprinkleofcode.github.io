import { createContext } from "react";
import type { Highlight } from "./frontmatter";

/**
 * The current story's frontmatter `highlight`, provided by the page around the
 * story body (Epic 2 retro F-6). `OutcomeBlock` reads its metric and unit from
 * here, so a story types its Outcome metric once, in frontmatter, and the
 * story and the homepage path card can't disagree. The page reads the
 * registry; the component never does (AD-7). Undefined outside a story page.
 */
export const StoryHighlightContext = createContext<Highlight | undefined>(undefined);
