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
