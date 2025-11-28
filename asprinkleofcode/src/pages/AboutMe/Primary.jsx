import { Avatar } from "flowbite-react";
import "./Primary.css";
import profilePic from "../../assets/profile-picture.jpg";
import StarBackground from "../../components/StarBackground/StarBackground";
import { FaCode } from "react-icons/fa";
import { TbAwardFilled } from "react-icons/tb";
import { FaCat } from "react-icons/fa6";

export default function Primary() {
  return (
    <section className="primary">
      <StarBackground count={30} />
      <div className="primary-content">
        <Avatar
          img={profilePic}
          rounded
          bordered
          size="xl"
          alt="Profile picture of Alisha Sprinkle Korba"
        />
        <h1> Hi, I’m Alisha Sprinkle Korba.</h1>
        <p>
          I’m a Sr. Software Engineer passionate about clean design, thoughtful
          engineering, and sprinkling a little bit of creativity into everything
          I build.
        </p>

        <div className="primary-badges">
          <div className="flex items-center gap-2">
            <FaCode className="w-5 h-5 text-blue-600" />
            <span>9+ Years Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <TbAwardFilled className="w-5 h-5 text-yellow-600" />
            <span>Certified Scrum Master</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCat className="w-5 h-5 text-orange-600" />
            <span>Cat Mom</span>
          </div>
        </div>
      </div>
    </section>
  );
}
