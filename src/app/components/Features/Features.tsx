import Image from "next/image";
import feature1 from "../../../../public/feature1.jpg";
import feature2 from "../../../../public/feature2.jpg";
import "./Features.css";

export default function Features() {
  return (
    <section className="features">
      <div className="features__ctns">
        <div data-aos="fade-right" className="features__ctn">
          <h2 className="features__ctn-title">
            Understand your job hunt like never before.
          </h2>
          <p className="features__ctn-p">
            Analyze response rates, interview conversions, and hiring trends so
            you can refine your strategy and land faster.
          </p>
        </div>
        <div data-aos="fade-down" className="features__ctn">
          <Image src={feature1} alt="features1" className="features__ctn-img" />
        </div>
        <div data-aos="fade-up" className="features__ctn">
          <Image src={feature2} alt="feature2" className="features__ctn-img" />
        </div>
        <div data-aos="fade-left" className="features__ctn">
          <h2 className="features__ctn-title">
            Never lose track of your progress.
          </h2>
          <p className="features__ctn-p">
            Store job links, notes, contacts, and follow-ups in one structured
            view. Everything you need for each role — organized and accessible.
          </p>
        </div>
      </div>
    </section>
  );
}
