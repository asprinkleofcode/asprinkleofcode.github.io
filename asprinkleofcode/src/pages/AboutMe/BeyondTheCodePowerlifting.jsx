import { Carousel } from "flowbite-react";
import "./BeyondTheCodePowerlifting.css";
import GradientWaves from "../../components/GradientWaves/GradientWaves";
import photo1 from "../../assets/pl-1.jpg";
import photo2 from "../../assets/pl-2.jpg";

export default function BeyondTheCodePowerlifting() {
  return (
    <section className="relative w-full py-20 flex flex-col items-center">
      <GradientWaves />
      <h1>Beyond the Code — Powerlifting</h1>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        <div className="flex flex-col gap-10 h-full">
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel pauseOnHover slideInterval={5000}>
              <iframe
                src="https://drive.google.com/file/d/1RHJBvlPYgu3c-SJBxHhD64AuE3YkBiWn/preview"
                className="relative w-full h-full"
              ></iframe>
              <iframe
                src="https://drive.google.com/file/d/1rWYIpN7_0LOP_l2RA6aktJlBGPZ3tmTL/preview"
                className="relative w-full h-full"
              ></iframe>
              <iframe
                src="https://drive.google.com/file/d/1y7e3A8FlzH_Ftg7tZzv0Qjuhi1Bui_BZ/preview"
                className="relative w-full h-full"
              ></iframe>
              <iframe
                src="https://drive.google.com/file/d/1Xhryg4sPQyJah_U_Fye3ZD9pbV-gWDtV/preview"
                className="relative w-full h-full"
              ></iframe>
              <img className="relative" src={photo1} />
              <img className="relative" src={photo2} />
            </Carousel>
          </div>
          <div className="w-full aspect-video rounded-xl shadow-lg overflow-hidden">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/nFapZ-ZvwUk?si=YudpwJNn9EhoPo65"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="flex flex-col justify-between h-full gap-5">
          <p className="text-lg text-center">
            Powerlifting keeps me grounded. It teaches me how to be patient with
            myself, how to show up consistently, and how to break tough things
            into manageable steps. Honestly, it feels a lot like software
            engineering. When you learn a new lift, you can’t rush it! You study
            the form, build a foundation, and improve one detail at a time.
            That’s exactly how I approach technical challenges: break it down,
            make it clean, and focus on getting a little better each iteration.
            Powerlifting has made me a more disciplined, thoughtful engineer and
            engineering has made me a more analytical lifter. I love that the
            two feed each other.
          </p>
          <h2>Current Personal Records</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <div className="pr-tile">
              <h3 className="pr-weight">187lb</h3>
              <p className="pr-label">Squat</p>
            </div>
            <div className="pr-tile">
              <h3 className="pr-weight">100lb</h3>
              <p className="pr-label">Bench</p>
            </div>
            <div className="pr-tile">
              <h3 className="pr-weight">292lb</h3>
              <p className="pr-label">Deadlift</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
