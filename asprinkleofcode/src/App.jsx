import { useState } from "react";
import "./App.css";
import { Button, ThemeProvider } from "flowbite-react";
import { aSprinkleOfCodeTheme } from "./theme/aSprinkleOfCodeTheme";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider theme={aSprinkleOfCodeTheme}>
        <Header />
        <main>{/* your landing page content */}</main>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
