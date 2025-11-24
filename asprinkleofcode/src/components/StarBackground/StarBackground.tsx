import { FaStar } from "react-icons/fa";
import "./StarBackground.css";

interface StarBackgroundProps {
  count?: number;
}

export default function StarBackground({ count = 20 }: StarBackgroundProps) {
  // Adjust density for mobile
  const starCount = window.innerWidth <= 768 ? Math.floor(count / 2) : count;

  // Generate stars with random positions, and 4 random theme colors
  const stars = Array.from({ length: starCount }).map(() => ({
    top: `${Math.random() * 90 + 5}%`,
    left: `${Math.random() * 90 + 5}%`,
    delay: `${Math.random() * 5}s`,
    size: `${Math.random() * 12 + 8}px`,
    colorIndex: Math.floor(Math.random() * 4)
  }));

  const colors = [
    "var(--color-primary-200)",
    "var(--color-primary-300)",
    "var(--color-primary-400)",
    "var(--color-primary-500)",
  ];

  return (
    <div className="star-sparkle-bg">
      {stars.map((star, idx) => (
        <FaStar
          key={idx}
          className="star-sparkle"
          style={{
            top: star.top,
            left: star.left,
            fontSize: star.size,
            color: colors[star.colorIndex],
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
