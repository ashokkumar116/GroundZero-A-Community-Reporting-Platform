
import About from '../Components/About';
import Cta from '../Components/Cta';
import Footer from '../Components/Footer';
import Hero from '../Components/Hero';
import HowItWorks from '../Components/HowItWorks';
import Testimonials from '../Components/Testimonials';

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <HowItWorks />
      <Testimonials />
      <Cta/>
      <Footer />
    </div>
  )
}

export default Home
