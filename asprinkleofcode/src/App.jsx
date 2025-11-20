import { useState } from "react";
import "./App.css";
import { Button, ThemeProvider } from "flowbite-react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Link } from "react-router";
import { aSprinkleOfCodeTheme } from "./theme/aSprinkleOfCodeTheme";
import Header from "./components/Header/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider theme={aSprinkleOfCodeTheme}>
        <Header />
        <a
          href="https://www.flaticon.com/free-icons/dessert"
          title="dessert icons"
        >
          Dessert icons created by Freepik - Flaticon
        </a>
      </ThemeProvider>
    </>
  );
}

export default App;
