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
          <Button color="primary" href="/about-me" size="lg">
            Learn About Me
          </Button>
          <Button color="secondary" href="https://github.com/users/asprinkleofcode/projects/1/views/1" size="lg">
            Follow the Build
          </Button>
        </div>
      </div>
    </section>
  );
}
