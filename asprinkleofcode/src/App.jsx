import { useState } from "react";
import "./App.css";
import { ThemeProvider } from "flowbite-react";
import { aSprinkleOfCodeTheme } from "./theme/aSprinkleOfCodeTheme";
import "./theme/colors.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./pages/Landing/LandingPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider theme={aSprinkleOfCodeTheme}>
        <Header />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <LandingPage />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
