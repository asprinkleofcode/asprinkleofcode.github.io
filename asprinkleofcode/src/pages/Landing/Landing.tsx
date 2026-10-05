import Recognition from "../../components/Recognition/Recognition";
import { IDENTITY } from "../../lib/identity";
import headshot from "../../assets/alisha-sprinkle-korba-headshot-640.webp";

// Homepage (Story 1.6). Story 1.7 adds Exploration and Evidence & Highlights below Recognition.
export default function Landing() {
  return <Recognition {...IDENTITY} headshotSrc={headshot} />;
}
