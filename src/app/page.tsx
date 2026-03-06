import Image from "next/image";
import NavBar from "./Components/NavBar/NavBar";
import styles from "./page.module.css";
import Hero from "./Components/Hero/Hero";
import Features from "./Components/Features/Features";
import HowItWorks from "./Components/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <NavBar />
        <Hero />
        <Features />
        <HowItWorks />
      </main>
    </div>
  );
}
