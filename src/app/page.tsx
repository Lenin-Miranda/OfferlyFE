import NavBar from "./components/NavBar/NavBar";
import styles from "./page.module.css";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Cta from "./components/Cta/Cta";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <NavBar />
        <Hero />
        <Features />
        <HowItWorks />
        <Cta />
        <Footer />
      </main>
    </div>
  );
}
