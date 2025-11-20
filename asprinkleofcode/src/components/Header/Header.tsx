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
  <Navbar fluid rounded>
    <NavbarBrand as={Link} href="https://flowbite-react.com">
      <img src="/cupcake.png" className="navbar-logo" alt="Cupcake Logo" />
      <span className="navbar-brand-text">Alisha Korba</span>
    </NavbarBrand>
    <NavbarToggle />
    <NavbarCollapse>
      <NavbarLink href="#" active>
        Home
      </NavbarLink>
      <NavbarLink as={Link} href="#">
        About
      </NavbarLink>
      <NavbarLink href="#">Services</NavbarLink>
      <NavbarLink href="#">Contact</NavbarLink>
      <NavbarLink href="#">Credits</NavbarLink>
    </NavbarCollapse>
  </Navbar>
);

export default Header;
