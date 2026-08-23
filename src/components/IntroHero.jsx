import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function IntroHero() {
  const root = useRef(null)
  const videoBox = useRef(null)

  useGSAP(() => {
    const setStart = () => {
      const w = window.innerWidth * 0.34
      const h = w * (16 / 9)
      gsap.set(videoBox.current, {
        width: w,
        height: h,
        left: (window.innerWidth - w) / 2,
        top: (window.innerHeight - h) / 2,
      })
    }
    setStart()
    ScrollTrigger.addEventListener('refreshInit', setStart)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '.intro-stage',
        invalidateOnRefresh: true,
      },
    })

    tl.to('.intro-text', { autoAlpha: 0, scale: 1.1, ease: 'power2.in' }, 0)
      .to(videoBox.current, {
        width: () => window.innerWidth * 0.16,
        height: () => window.innerWidth * 0.16 * (16 / 9),
        left: () => window.innerWidth - window.innerWidth * 0.16 - 32,
        top: () => window.innerHeight - window.innerWidth * 0.16 * (16 / 9) - 32,
        borderRadius: 16,
        ease: 'power2.inOut',
      }, 0)

    return () => ScrollTrigger.removeEventListener('refreshInit', setStart)
  }, { scope: root })

  return (
    <section ref={root} className="h-[250vh]">
      <div className="intro-stage h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
        <h1 className="intro-text absolute z-0 text-white font-black tracking-tighter leading-none text-[26vw] select-none">
          ZYRO
        </h1>
      </div>
      <div
        ref={videoBox}
        className="fixed z-40 overflow-hidden rounded-3xl shadow-2xl bg-neutral-800 pointer-events-none"
      >
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline src="/intro.mp4" />
      </div>
    </section>
  )
}