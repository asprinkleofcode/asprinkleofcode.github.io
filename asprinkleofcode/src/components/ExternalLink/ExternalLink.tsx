import type { ComponentPropsWithoutRef, FC } from "react";
import { HiArrowUpRight } from "react-icons/hi2";
import { textLinkClasses } from "../../lib/linkClasses";
import "./ExternalLink.css";

export interface ExternalLinkProps
  extends Omit<ComponentPropsWithoutRef<"a">, "href" | "target" | "rel"> {
  href: string;
}

/**
 * Outbound text link (UX-DR16): opens in a new tab with `noopener noreferrer`,
 * shows a visible "leaves the site" arrow, and tells screen readers it opens a
 * new tab.
 */
const ExternalLink: FC<ExternalLinkProps> = ({ href, className, children, ...rest }) => (
  <a
    {...rest}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`external-link ${textLinkClasses}${className ? ` ${className}` : ""}`}
  >
    {children}
    <HiArrowUpRight aria-hidden="true" focusable="false" className="external-link__arrow" />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

export default ExternalLink;
