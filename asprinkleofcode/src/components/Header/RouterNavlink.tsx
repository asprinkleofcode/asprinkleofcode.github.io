import { NavbarLink } from "flowbite-react";
import { useLocation } from "react-router";

interface RouterNavbarLinkProps {
  to: string; // e.g., "/", "/about-me"
  children: React.ReactNode;
}

export const RouterNavbarLink = ({ to, children }: RouterNavbarLinkProps) => {
  const location = useLocation();

  // Create hash path for href
  const hashPath = to === "/" ? "#/" : `#${to}`;

  const isActive = location.pathname === to;
  return (
    <NavbarLink href={hashPath} active={isActive}>
      {children}
    </NavbarLink>
  );
};
