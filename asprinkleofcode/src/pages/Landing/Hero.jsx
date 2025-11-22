import { Button } from "flowbite-react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <span className={`sparkle sparkle1`}>✨</span>
      <span className={`sparkle sparkle2`}>✨</span>
      <span className={`sparkle sparkle3`}>✨</span>
      <span className={`sparkle sparkle4`}>✨</span>

      <div className="hero-content">
        <h1>Welcome!</h1>

        <p>
          A portfolio woven together with creativity, curiosity, and thoughtful
          engineering. Come explore how my life is so much better thanks to <span className="highlight">a sprinkle of code.</span>
        </p>

        <div className="flex justify-center gap-4">
          <Button color="primary" size="lg">
            Explore My Work
          </Button>
          <Button color="secondary" size="lg">
            Follow the Build
          </Button>
        </div>
      </div>
    </section>
  );
}
