import Recognition from "../../components/Recognition/Recognition";
import ExplorationPaths from "../../components/ExplorationPaths/ExplorationPaths";
import EvidenceHighlights from "../../components/EvidenceHighlights/EvidenceHighlights";
import { IDENTITY } from "../../lib/identity";
import { getFeaturedEntry } from "../../lib/registry";
import headshot from "../../assets/alisha-sprinkle-korba-headshot-640.webp";

// Homepage (EXPERIENCE §6.1): Recognition, then Exploration, then Evidence & Highlights.
export default function Landing() {
  return (
    <>
      <Recognition {...IDENTITY} headshotSrc={headshot} />
      <ExplorationPaths />
      <EvidenceHighlights
        engineering={getFeaturedEntry("engineering")}
        leadership={getFeaturedEntry("leadership")}
        beyond={getFeaturedEntry("beyond")}
      />
    </>
  );
}
