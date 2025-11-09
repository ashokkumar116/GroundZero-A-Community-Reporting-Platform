import About from "../Components/Landing/About"
import Cta from "../Components/Landing/Cta"
import Hero from "../Components/Landing/Hero"
import HowItWorks from "../Components/Landing/HowItWorks"
import Testimonials from "../Components/Landing/Testimonials"


const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <HowItWorks />
      <Testimonials />
      <Cta />
    </div>
  )
}

export default Home
