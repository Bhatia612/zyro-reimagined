import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import videoAdd from "../assets/branding/add.mp4"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function IntroHero() {
  const root = useRef(null)
  const videoBox = useRef(null)
  const videoEl = useRef(null)


  const [ratio, setRatio] = useState(null)

  function sizes(ratio) {
    const vw = window.innerWidth
    const vh = window.innerHeight

    const fit = (maxW, maxH) => {
      let w = maxW
      let h = w / ratio
      if (h > maxH) {
        h = maxH
        w = h * ratio
      }
      return { w, h }
    }

    const f = fit(vw, vh)
    const ins = fit(vw * 0.7, vh * 0.7)
    const cw = vw * 0.16
    const ch = cw / ratio

    return {
      full: { width: f.w, height: f.h, left: (vw - f.w) / 2, top: (vh - f.h) / 2, borderRadius: 0 },
      inset: { width: ins.w, height: ins.h, left: (vw - ins.w) / 2, top: (vh - ins.h) / 2, borderRadius: 0 },
      corner: { width: cw, height: ch, left: vw - cw - 32, top: vh - ch - 32, borderRadius: 0 },
    }
  }

  useGSAP(() => {
    if (!ratio) return

    gsap.set(videoBox.current, sizes(ratio).full)
    gsap.set('.intro-text', { xPercent: 120, autoAlpha: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: '.intro-stage',
        invalidateOnRefresh: true,
      },
    })

    tl.to(videoBox.current, { ...sizes(ratio).inset, ease: 'none', duration: 2 }, 0)
      .to('.intro-text', { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 2 }, 0)
      .to({}, { duration: 1 })
      .to(videoBox.current, { ...sizes(ratio).corner, ease: 'power4.in', duration: 1 })
      .to('.intro-text', { xPercent: -30, autoAlpha: 0, ease: 'power4.in', duration: .5 }, '<')
      .call(() => window.dispatchEvent(new CustomEvent('video:docked')))

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, { dependencies: [ratio], scope: root })




  useEffect(() => {
    const v = videoEl.current
    if (!v) return
    let usedGesture = false

    const firstGesture = () => {
      if (usedGesture) return
      usedGesture = true
      v.muted = false
      v.play().catch(() => { v.muted = true })
      window.removeEventListener('scroll', firstGesture)
      window.removeEventListener('click', firstGesture)
    }
    window.addEventListener('scroll', firstGesture, { once: false })
    window.addEventListener('click', firstGesture)

    const stop = () => { v.muted = true; v.pause() }
    const resume = () => { v.muted = false; v.play().catch(() => { v.muted = false }) }
    window.addEventListener('video:stop', stop)
    window.addEventListener('video:resume', resume)
    return () => {
      window.removeEventListener('scroll', firstGesture)
      window.removeEventListener('click', firstGesture)
      window.removeEventListener('video:stop', stop)
      window.removeEventListener('video:resume', resume)
    }
  }, [])




  return (
    <section ref={root} className="h-[200vh]">
      <div className="intro-stage fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-base">
        <h1 className="intro-text absolute z-0 text-ink font-display tracking-tighter leading-none text-[26vw] select-none">
          ZYRO
        </h1>
      </div>
      <div
        ref={videoBox}
        className="fixed z-20 overflow-hidden shadow-2xl bg-neutral-800 pointer-events-none"
        style={{ width: '60vw', height: '34vw', left: '20vw', top: '20vh' }}
      >
        <video
          id='addvid'
          ref={videoEl}
          onLoadedMetadata={(e) => {
            setRatio(e.target.videoWidth / e.target.videoHeight)
          }}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src={videoAdd}
        />
      </div>
    </section>
  )
}