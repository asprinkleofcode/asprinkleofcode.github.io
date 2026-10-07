import type { FC } from "react";
import type { IconType } from "react-icons";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";
import {
  FooterCopyright,
  FooterIcon,
  Footer as FlowbiteFooter,
} from "flowbite-react";
import ExternalLink from "../ExternalLink/ExternalLink";
import {
  FLATICON_CREDIT_URL,
  FOOTER_LINKS,
  footerLinkName,
  type FooterLink,
  type FooterPlatform,
} from "../../lib/links";

const PLATFORM_ICONS: Record<FooterPlatform, IconType> = {
  LinkedIn: BsLinkedin,
  Instagram: BsInstagram,
  GitHub: BsGithub,
};

// The brand glow on hover for every icon, except @orangecatwoodcraft, which
// turns apricot and glows in glow.woodcraft on hover and keyboard focus only
// (UX-028). Its colour classes override the theme's hover:text-brand-primary.
const glowClasses = (variant: FooterLink["variant"]) =>
  variant === "woodcraft"
    ? "hover:text-woodcraft focus-visible:text-woodcraft hover:drop-shadow-glow-woodcraft focus-visible:drop-shadow-glow-woodcraft"
    : "hover:drop-shadow-glow";

const Footer: FC = () => (
  <FlowbiteFooter container>
    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* Leading space: flowbite renders "© ", the year, then this span with no separator. */}
      <FooterCopyright by=" Alisha Korba" year={new Date().getFullYear()} />
      <nav aria-label="Social profiles">
        <ul className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <FooterIcon
                href={link.href}
                icon={PLATFORM_ICONS[link.label]}
                ariaLabel={footerLinkName(link)}
                target="_blank"
                rel="noopener noreferrer"
                className={glowClasses(link.variant)}
              />
            </li>
          ))}
        </ul>
      </nav>
      <div className="type-meta">
        <ExternalLink href={FLATICON_CREDIT_URL}>Cupcake icon by Flaticon</ExternalLink>
      </div>
    </div>
  </FlowbiteFooter>
);

export default Footer;
