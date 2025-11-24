import Primary from "./Primary";
import "./AboutMe.css";

import StarBackground from "../../components/StarBackground/StarBackground";
export default function AboutMe() {
  return (
    <section>
      <StarBackground count={30} />
      <Primary />
    </section>
  );
}
