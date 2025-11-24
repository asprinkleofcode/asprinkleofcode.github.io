import React, { FC } from "react";
import "./Header.css";
import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
} from "flowbite-react";
import { Link } from "react-router";
import { RouterNavbarLink } from "./RouterNavlink";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => (
  <Navbar fluid>
    <NavbarBrand as={Link} href="https://flowbite-react.com">
      <img src="/cupcake.png" className="navbar-logo" alt="Cupcake Logo" />
      <span className="navbar-brand-text">Alisha Korba</span>
    </NavbarBrand>
    <NavbarToggle />
    <NavbarCollapse>
      <RouterNavbarLink to="/">Home</RouterNavbarLink>
      <RouterNavbarLink to="/about-me">About Me</RouterNavbarLink>
    </NavbarCollapse>
  </Navbar>
);

export default Header;
