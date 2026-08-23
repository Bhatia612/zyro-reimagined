import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import videoAdd from "../assets/add/add.mp4"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function IntroHero() {
  const root = useRef(null)
  const videoBox = useRef(null)
  const videoEl = useRef(null)
  const ratio = useRef(9 / 16)

  useGSAP(() => {
    const full = () => {
      const r = ratio.current
      let w = window.innerWidth
      let h = w / r
      if (h > window.innerHeight) {
        h = window.innerHeight
        w = h * r
      }
      return { width: w, height: h, left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, borderRadius: 0 }
    }

    const inset = () => {
      const r = ratio.current
      let w = window.innerWidth * 0.85
      let h = w / r
      if (h > window.innerHeight * 0.85) {
        h = window.innerHeight * 0.85
        w = h * r
      }
      return { width: w, height: h, left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, borderRadius: 24 }
    }

    const corner = () => {
      const r = ratio.current
      const w = window.innerWidth * 0.16
      const h = w / r
      return { width: w, height: h, left: window.innerWidth - w - 32, top: window.innerHeight - h - 32, borderRadius: 16 }
    }

    gsap.set(videoBox.current, full())
    gsap.set('.intro-text', { xPercent: 120, autoAlpha: 0 })

    gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
    })
      .to(videoBox.current, { ...inset(), ease: 'none' }, 0)
      .to('.intro-text', { xPercent: 0, autoAlpha: 1, ease: 'none' }, 0)


    let docked = false
    const dock = () => {
      if (docked) return
      docked = true
      gsap.to(videoBox.current, {
        ...corner(), duration: 0.35, ease: 'power4.in', overwrite: true,
        onComplete: () => window.dispatchEvent(new CustomEvent('video:docked')),
      })
      gsap.to('.intro-text', { xPercent: -30, autoAlpha: 0, duration: 0.4, ease: 'power2.in', overwrite: true })
    }
    const undock = () => {
      if (!docked) return
      docked = false
      gsap.to(videoBox.current, { ...inset(), duration: 0.35, ease: 'power2.out', overwrite: true })
      gsap.to('.intro-text', { xPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out', overwrite: true })
      window.dispatchEvent(new CustomEvent('video:undocked'))
    }

    ScrollTrigger.create({
      trigger: root.current,
      start: 'bottom bottom',
      onEnter: dock,
      onLeaveBack: undock,
      invalidateOnRefresh: true,
    })

    const onResize = () => gsap.set(videoBox.current, docked ? corner() : full())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, { scope: root })

  return (
    <section ref={root} className="h-screen">
      <div className="intro-stage fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-neutral-950">
        <h1 className="intro-text absolute z-0 text-white font-black tracking-tighter leading-none text-[26vw] select-none">
          ZYRO
        </h1>
      </div>
      <div
        ref={videoBox}
        className="fixed z-20 overflow-hidden shadow-2xl bg-neutral-800 pointer-events-none"
      >
        <video
          ref={videoEl}
          onLoadedMetadata={(e) => {
            ratio.current = e.target.videoWidth / e.target.videoHeight
            ScrollTrigger.refresh()
          }}
          className="h-full w-full object-cover"
          autoPlay
          loop
          playsInline
          src={videoAdd} />
      </div>
    </section>
  )
}