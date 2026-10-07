import Primary from "./Primary.jsx";
import "./AboutMe.css";
import BeyondTheCodePowerlifting from "./BeyondTheCodePowerlifting.jsx";

// LEGACY, temporary: the pre-epic About page, reachable at `/about` only until
// Epic 4 replaces it. `about-me` scopes the legacy element styles in AboutMe.css.
export default function AboutMe() {
  return (
    <section className="about-me">
      <Primary />
      <BeyondTheCodePowerlifting />
    </section>
  );
}
