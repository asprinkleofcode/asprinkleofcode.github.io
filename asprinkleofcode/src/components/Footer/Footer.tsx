import { FC } from "react";
import "./Footer.css";
import {
  FooterCopyright,
  FooterIcon,
  Footer as FlowbiteFooter,
} from "flowbite-react";
import { BsLinkedin, BsGithub, BsInstagram, Bs1Circle } from "react-icons/bs";
interface FooterProps {}

const Footer: FC<FooterProps> = () => (
  <FlowbiteFooter container>
    <div className="w-full">
      <div className="w-full sm:flex sm:items-center sm:justify-between">
        <FooterCopyright href="#" by="Alisha Korba" year={2025} />
        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
          <FooterIcon
            href="https://www.linkedin.com/in/alishasprinklekorba"
            icon={BsLinkedin}
          />
          <FooterIcon
            href="https://www.instagram.com/asprinkleofcode/"
            icon={BsInstagram}
          />
          <FooterIcon
            href="https://github.com/asprinkleofcode"
            icon={BsGithub}
          />
          <FooterIcon
            href="https://www.flaticon.com/free-icons/dessert"
            icon={Bs1Circle}
          />
        </div>
      </div>
    </div>
  </FlowbiteFooter>
);

export default Footer;
