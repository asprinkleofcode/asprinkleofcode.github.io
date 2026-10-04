// Legacy `.jsx` pages are not type-checked (`allowJs` is off). Typed files may
// import them with an explicit `.jsx` extension; each is treated as a React
// component default export. Migrate a page to `.tsx` to get real types.
declare module "*.jsx" {
  import type { ComponentType } from "react";
  const Component: ComponentType;
  export default Component;
}
