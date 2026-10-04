import { Link } from "react-router";
import { textLinkClasses } from "../../lib/linkClasses";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="type-section text-text-primary">Page not found</h1>
      <p className="type-body mt-4 text-text-secondary">
        There's nothing at this address. It may have moved, or the link may have a typo.
      </p>
      <Link to="/" className={`type-body mt-6 ${textLinkClasses}`}>
        Go to the homepage
      </Link>
    </section>
  );
}
