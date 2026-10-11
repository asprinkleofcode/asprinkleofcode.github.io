/**
 * Alisha's identity wording, as the homepage states it. The static head in
 * `index.html` owns this claim (AD-14): its title, description and Person
 * JSON-LD `name`/`jobTitle`/`description` mirror these strings, and the App
 * smoke test fails if the two drift apart. Change both together.
 */
export const IDENTITY = {
  name: "Alisha Sprinkle Korba",
  title: "Senior Software Engineer",
  positioning: "Give me a business problem and I'll turn it into an engineering decision worth trusting.",
} as const;

/**
 * The site's canonical URL, as `index.html`'s `<link rel="canonical">` states
 * it; the App smoke test fails if the two drift apart. Per-story JSON-LD
 * builds its `url` and author `@id` from it.
 */
export const SITE_URL = "https://alishasprinklekorba.com/";
