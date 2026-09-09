import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Journey from "./components/Journey";
import Contact from "./components/Contact";

export default function App() {
  return (
    <div className="site">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
