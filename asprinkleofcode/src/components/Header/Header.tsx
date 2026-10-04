import type { FC } from "react";
import "./Header.css";
import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
} from "flowbite-react";
import { Link, type LinkProps } from "react-router";
import { RouterNavbarLink } from "./RouterNavlink";

// NavbarBrand's `as` prop is not polymorphically typed, so `to` can't be passed
// through it directly; bind the router destination here instead.
const HomeLink: FC<Omit<LinkProps, "to">> = (props) => <Link {...props} to="/" />;

const Header: FC = () => (
  <Navbar fluid>
    <NavbarBrand as={HomeLink}>
      <img src="/cupcake.png" className="navbar-logo" alt="Cupcake Logo" />
      <span className="navbar-brand-text">Alisha Korba</span>
    </NavbarBrand>
    <NavbarToggle />
    <NavbarCollapse>
      <RouterNavbarLink to="/">Home</RouterNavbarLink>
      <RouterNavbarLink to="/about">About Me</RouterNavbarLink>
    </NavbarCollapse>
  </Navbar>
);

export default Header;
