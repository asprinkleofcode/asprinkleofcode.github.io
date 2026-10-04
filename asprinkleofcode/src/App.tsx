import "./App.css";
import { ThemeProvider } from "flowbite-react";
import { Route, Routes } from "react-router";
import { aSprinkleOfCodeTheme } from "./theme/aSprinkleOfCodeTheme";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./pages/Landing/LandingPage.jsx";
import AboutMe from "./pages/AboutMe/AboutMe.jsx";

function App() {
  return (
    <ThemeProvider theme={aSprinkleOfCodeTheme}>
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutMe />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
