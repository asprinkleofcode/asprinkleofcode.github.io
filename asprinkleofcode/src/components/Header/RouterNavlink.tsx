import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { NavbarLink } from "flowbite-react";
import { Link, useLocation } from "react-router";
import { isNavActive } from "../../lib/isNavActive";

interface RouterNavbarLinkProps {
  to: string; // e.g. "/", "/engineering"
  children: ReactNode;
}

// NavbarLink's `as` prop is not polymorphically typed, so it can't take `to`.
// This adapter receives NavbarLink's `href` and renders a router `Link`, so
// navigation goes through the router as PUSH (not a raw hash change, which
// reaches the router as POP and breaks forward/back scroll handling).
const RouterAnchor = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(({ href, ...props }, ref) => (
  <Link {...props} ref={ref} to={href ?? "/"} />
));
RouterAnchor.displayName = "RouterAnchor";

// flowbite-react 0.12.5's NavbarLink already calls the navbar context's
// `setIsOpen(false)` on click, so picking a link closes the mobile menu.
export const RouterNavbarLink = ({ to, children }: RouterNavbarLinkProps) => {
  const { pathname } = useLocation();
  const isActive = isNavActive(pathname, to);
  return (
    <NavbarLink as={RouterAnchor} href={to} active={isActive} aria-current={isActive ? "page" : undefined}>
      {children}
    </NavbarLink>
  );
};
