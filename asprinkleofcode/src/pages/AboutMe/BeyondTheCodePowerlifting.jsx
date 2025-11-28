import { Carousel } from "flowbite-react";
import GradientWaves from "../../components/GradientWaves/GradientWaves";
import photo1 from "../../assets/pl-1.jpg";
import photo2 from "../../assets/pl-2.jpg";

export default function BeyondTheCodePowerlifting() {
  return (
    <section className="relative w-full py-20 flex flex-col items-center">
      <GradientWaves />
      <h1>
        Beyond the Code — Powerlifting
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-10">
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel slideInterval={5000}>
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

        <div className="flex flex-col gap-6 h-fit mt-4">
          <p className="text-lg text-center">
            Powerlifting keeps me grounded. It teaches me how to be patient with
            myself, how to show up consistently, and how to break tough things
            into manageable steps. Honestly, it feels a lot like software
            engineering. When you learn a new lift, you can’t rush it! You study
            the form, build a foundation, and improve one detail at a time.
            That’s exactly how I approach technical challenges: break it down,
            make it clean, and focus on getting a little better each iteration.
            Powerlifting has made me a more disciplined, thoughtful engineer
            and engineering has made me a more analytical lifter.
            I love that the two feed each other.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-xl shadow-md bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-lg font-medium text-center">Bench PR</p>
              <p className="text-2xl font-bold text-center text-primary-400">
                100 lbs
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-md bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-lg font-medium text-center">Squat PR</p>
              <p className="text-2xl font-bold text-center text-primary-400">
                187 lbs
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-md bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-lg font-medium text-center">Deadlift PR</p>
              <p className="text-2xl font-bold text-center text-primary-400">
                292 lbs
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-md bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-lg font-medium text-center">Training Since</p>
              <p className="text-2xl font-bold text-center text-primary-400">
                2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
