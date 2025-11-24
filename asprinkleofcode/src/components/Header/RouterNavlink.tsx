import { NavbarLink } from "flowbite-react";
import { useLocation } from "react-router";

interface RouterNavbarLinkProps {
  to: string;
  children: React.ReactNode;
}

export const RouterNavbarLink = ({ to, children }: RouterNavbarLinkProps) => {
  const location = useLocation();

  return (
    <NavbarLink href={to} active={location.pathname === to}>
      {children}
    </NavbarLink>
  );
};
