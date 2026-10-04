import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { NavbarLink } from "flowbite-react";
import { Link, useLocation } from "react-router";

interface RouterNavbarLinkProps {
  to: string; // e.g., "/", "/about"
  children: React.ReactNode;
}

// NavbarLink's `as` prop is not polymorphically typed, so it can't take `to`.
// This adapter receives NavbarLink's `href` and renders a router `Link`, so
// navigation goes through the router as PUSH (not a raw hash change, which
// reaches the router as POP and breaks forward/back scroll handling).
const RouterAnchor = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(({ href, ...props }, ref) => (
  <Link {...props} ref={ref} to={href ?? "/"} />
));
RouterAnchor.displayName = "RouterAnchor";

export const RouterNavbarLink = ({ to, children }: RouterNavbarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavbarLink as={RouterAnchor} href={to} active={isActive}>
      {children}
    </NavbarLink>
  );
};
