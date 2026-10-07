import { Suspense, useLayoutEffect, useRef } from "react";
import { ThemeProvider } from "flowbite-react";
import { Route, Routes, useLocation, useNavigationType } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "./theme/aSprinkleOfCodeTheme";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AmbientLayer from "./components/AmbientLayer/AmbientLayer";
import { AmbientBoundary } from "./components/AmbientLayer/AmbientBoundary";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { lazyWithRetry, retryFailedImports } from "./lib/lazyWithRetry";
import { useNavigationScroll, type SettleRoute } from "./lib/useNavigationScroll";

// Fixed route table (AD-5); every route page is its own lazy chunk (AD-6),
// imported again after navigating away from a failed load (retryFailedImports).
const Landing = lazyWithRetry(() => import("./pages/Landing/Landing"));
const Engineering = lazyWithRetry(() => import("./pages/Engineering/Engineering"));
const Leadership = lazyWithRetry(() => import("./pages/Leadership/Leadership"));
const Beyond = lazyWithRetry(() => import("./pages/Beyond/Beyond"));
const WorkStory = lazyWithRetry(() => import("./pages/WorkStory/WorkStory"));
const Personal = lazyWithRetry(() => import("./pages/Personal/Personal"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound/NotFound"));
// LEGACY, temporary: `/about` sits outside AD-5's route set. Nothing links to it
// any more (the header dropped it in Story 1.4, the Landing hero buttons in
// Story 1.6); it stays reachable by URL only until Epic 4 replaces AboutMe.
const AboutMe = lazyWithRetry(() => import("./pages/AboutMe/AboutMe"));

/**
 * Sibling of `<Routes>` inside the route `Suspense` boundary: the boundary
 * never commits part of its tree, so this layout effect runs for a new
 * location only once the page (and any story body) has resolved. The error
 * boundary also renders it beside its fallback, so a navigation into a route
 * that throws or fails to load still settles (AD-19).
 */
function RouteSettled({ onSettle }: { onSettle: SettleRoute }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    onSettle(location.key, navigationType);
  }, [location.key, navigationType, onSettle]);
  return null;
}

function App() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const settle = useNavigationScroll(mainRef);

  return (
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      <AmbientBoundary>
        {/* Keyed per navigation so every page gets a freshly shuffled field. */}
        <AmbientLayer key={location.key} />
      </AmbientBoundary>
      <Header />
      <div className="flex flex-1 flex-col">
        <main ref={mainRef} className="flex-1">
          <ErrorBoundary
            resetKey={location.key}
            onReset={retryFailedImports}
            alongsideFallback={<RouteSettled onSettle={settle} />}
          >
            <Suspense
              fallback={
                <p role="status" className="sr-only">
                  Loading…
                </p>
              }
            >
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/engineering" element={<Engineering />} />
                <Route path="/engineering/:slug" element={<WorkStory path="engineering" />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/leadership/:slug" element={<WorkStory path="leadership" />} />
                <Route path="/beyond" element={<Beyond />} />
                <Route path="/beyond/:slug" element={<Personal />} />
                <Route path="/about" element={<AboutMe />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <RouteSettled onSettle={settle} />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
