import { useState } from "react";
import "./App.css";
import { ThemeProvider } from "flowbite-react";
import { aSprinkleOfCodeTheme } from "./theme/aSprinkleOfCodeTheme";
import "./theme/colors.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./pages/Landing/LandingPage";
import AboutMe from "./pages/AboutMe/AboutMe";
import { Route, Routes } from "react-router";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider theme={aSprinkleOfCodeTheme}>
        <Header />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Routes>
              <Route path="" element={<LandingPage />} />
              <Route path="/about-me" element={<AboutMe />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
