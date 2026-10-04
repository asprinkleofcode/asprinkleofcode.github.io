/**
 * MDX block whitelist (AD-8).
 *
 * Rule: this module is the only place MDX content may import components
 * from. Each `.mdx` file imports the blocks it uses explicitly from here —
 * there is no `MDXProvider` and no globally injected components. A block is
 * added here (with its own component under `src/components/`) before any
 * content uses it.
 *
 * Empty until Story 2.1 adds the first blocks.
 */
export {};
