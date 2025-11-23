import React, { FC } from "react";
import "./Header.css";
import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
} from "flowbite-react";
import { Link } from "react-router";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => (
  <Navbar fluid>
    <NavbarBrand as={Link} href="https://flowbite-react.com">
      <img src="/cupcake.png" className="navbar-logo" alt="Cupcake Logo" />
      <span className="navbar-brand-text">Alisha Korba</span>
    </NavbarBrand>
    <NavbarToggle />
    <NavbarCollapse>
      <NavbarLink href="/" active>
        Home
      </NavbarLink>
      <NavbarLink href="/about-me">
        About
      </NavbarLink>
    </NavbarCollapse>
  </Navbar>
);

export default Header;
