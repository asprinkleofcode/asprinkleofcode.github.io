import { useEffect, type FC } from "react";
import "./Header.css";
import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  useNavbarContext,
} from "flowbite-react";
import { Link, useLocation, type LinkProps } from "react-router";
import { RouterNavbarLink } from "./RouterNavlink";

// NavbarBrand's `as` prop is not polymorphically typed, so `to` can't be passed
// through it directly; bind the router destination here instead.
const HomeLink: FC<Omit<LinkProps, "to">> = (props) => <Link {...props} to="/" />;

// Collapses the mobile menu after any navigation (brand link, Back, in-page
// links), not only after a NavbarLink click.
const CloseMenuOnNavigate: FC = () => {
  const { key } = useLocation();
  const { setIsOpen } = useNavbarContext();
  useEffect(() => {
    setIsOpen(false);
  }, [key, setIsOpen]);
  return null;
};

/** Flat, sticky top-level nav (EXPERIENCE §5.2): identical on every route. */
const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/engineering", label: "Engineering" },
  { to: "/leadership", label: "Leadership & Enablement" },
  { to: "/beyond", label: "Beyond the Code" },
] as const;

const Header: FC = () => (
  <Navbar fluid aria-label="Main">
    <CloseMenuOnNavigate />
    <NavbarBrand as={HomeLink} className="navbar-brand">
      {/* Cupcake mark recoloured to brand.primary with a CSS mask (DESIGN §6). */}
      <span aria-hidden="true" className="navbar-logo" />
      {/* White ~1rem/700 wordmark (UX-030), deliberately independent of `type-title`. */}
      <span className="navbar-brand-text text-base tracking-[0.02em]">Alisha Korba</span>
    </NavbarBrand>
    <NavbarToggle />
    <NavbarCollapse>
      {NAV_ITEMS.map(({ to, label }) => (
        <RouterNavbarLink key={to} to={to}>
          {label}
        </RouterNavbarLink>
      ))}
    </NavbarCollapse>
  </Navbar>
);

export default Header;
