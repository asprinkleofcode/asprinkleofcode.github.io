/**
 * Prose typography for an MDX story body (DESIGN §8, epic 2 prose styling),
 * scoped to the body wrapper through arbitrary variants so no bare global
 * element rule exists (`globalCss.test.ts`). Block spacing reaches only the
 * body's own paragraphs, lists, subheadings and photos and those directly inside a
 * `StorySection`, never the inside of a Decision or Outcome block. Inline
 * links are always underlined, so colour is never their only cue.
 */
export const storyProseClasses = [
  "type-body text-text-primary",
  "[&>p]:my-4 [&_section>p]:my-4",
  "[&>ul]:my-4 [&_section>ul]:my-4 [&>ol]:my-4 [&_section>ol]:my-4",
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mt-1",
  // A Photo block in the body gets breathing room; a hero outside the body does not.
  "[&>figure]:my-8 [&_section>figure]:my-8",
  "[&>h3]:type-story [&_section>h3]:type-story [&>h3]:mt-8 [&_section>h3]:mt-8 [&>h3]:mb-2 [&_section>h3]:mb-2",
  "[&_strong]:font-semibold [&_strong]:text-text-primary [&_code]:font-mono [&_code]:text-[0.9em]",
  // Long code lines scroll inside the block instead of widening the page on a phone.
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-default [&_pre]:border [&_pre]:border-border-default [&_pre]:bg-background-secondary [&_pre]:p-4",
  "[&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:rounded-control",
  "[&_a:focus]:outline-hidden [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-focus-ring [&_a:focus-visible]:ring-offset-2 [&_a:focus-visible]:ring-offset-background-primary",
].join(" ");
