/**
 * Header active state: a path link is active on its index and on its stories
 * (`/leadership`, `/leadership/x`); Home is active only on `/`.
 */
export function isNavActive(pathname: string, to: string): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}
