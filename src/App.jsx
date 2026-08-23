import { useSmoothScroll } from './hooks/useSmoothScroll'
import Nav from './components/Nav'
import IntroHero from './components/IntroHero'
import IntroText from './components/IntroText'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import FlavorGrid from './components/FlavorGrid'
import Footer from './components/Footer'

export default function App() {
  useSmoothScroll()
  return (
    <>
      <Nav />
      <main>
        <IntroHero />
        <IntroText />
        <Hero />
        <Marquee />
        <FlavorGrid />
      </main>
      <Footer />
    </>
  )
}