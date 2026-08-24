import { useSmoothScroll } from './hooks/useSmoothScroll'
import Nav from './components/Nav'
import IntroHero from './components/IntroHero'
import IntroText from './components/IntroText'
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
        <FlavorGrid />
        <Marquee />
      </main>
      <Footer />
    </>
  )
}