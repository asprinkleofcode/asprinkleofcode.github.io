import Recognition from "../../components/Recognition/Recognition";
import PathCards from "../../components/PathCards/PathCards";
import { IDENTITY } from "../../lib/identity";
import { getFeaturedEntries } from "../../lib/registry";
import headshot from "../../assets/alisha-sprinkle-korba-headshot-640.webp";

// Homepage (EXPERIENCE §6.1, UX-031): Recognition, then the three path cards.
export default function Landing() {
  return (
    <>
      <Recognition {...IDENTITY} headshotSrc={headshot} />
      <PathCards
        slides={{
          engineering: getFeaturedEntries("engineering"),
          leadership: getFeaturedEntries("leadership"),
          beyond: getFeaturedEntries("beyond"),
        }}
      />
    </>
  );
}
