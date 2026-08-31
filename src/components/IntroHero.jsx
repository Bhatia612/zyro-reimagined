import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import videoAdd from "../assets/branding/add.mp4"
import videoAddMobile from "../assets/branding/add-mobile.mp4"
import { Volume2, VolumeX } from 'lucide-react'
import logo from "../assets/branding/logo-zyro.png"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function IntroHero() {
  const root = useRef(null)
  const videoBox = useRef(null)
  const videoEl = useRef(null)
  const [docked, setDocked] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ratio, setRatio] = useState(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function sizes(ratio) {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const fit = (maxW, maxH) => {
      let w = maxW
      let h = w / ratio
      if (h > maxH) { h = maxH; w = h * ratio }
      return { w, h }
    }
    const f = fit(vw, vh)
    const ins = fit(vw * 0.7, vh * 0.7)
    const cw = vw * 0.26
    const ch = cw / ratio
    return {
      full: { width: f.w, height: f.h, left: (vw - f.w) / 2, top: (vh - f.h) / 2, borderRadius: 0 },
      inset: { width: ins.w, height: ins.h, left: (vw - ins.w) / 2, top: (vh - ins.h) / 2, borderRadius: 4 },
      corner: { width: cw, height: ch, left: vw - cw - 32, top: vh - ch - 32, borderRadius: 4 },
    }
  }

  useGSAP(() => {
    if (window.innerWidth >= 768) return
    gsap.from('.intro-logo', {
      x: () => window.innerWidth,
      autoAlpha: 0,
      ease: 'power3.out',
      duration: 0.9,
      delay: 0.3,
    })
  }, { scope: root })

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      if (!ratio) return
      // desktop entrance: slide in from right, settle center, shrink
      gsap.timeline()
        .from('.intro-logo', { xPercent: 120, ease: 'power3.out', duration: .9 })
        .to('.intro-logo', { scale: 0.7, ease: 'power2.inOut', duration: 0.3 }, '+=0.1')

      const s = sizes(ratio)
      gsap.set(videoBox.current, { ...s.full, top: window.innerHeight, autoAlpha: 1 })
      gsap.set('.intro-word', { autoAlpha: 1, yPercent: 0, y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: '.intro-bg',
          invalidateOnRefresh: true,
        },
      })

      tl.to(videoBox.current, { top: s.full.top, ease: 'power2.out', duration: 2 }, 0)
        .to('.intro-word', { autoAlpha: 0, yPercent: -30, ease: 'power2.in', duration: 1 }, 0.5)
        .to(videoBox.current, { ...s.inset, ease: 'none', duration: 2 })
        .to({}, { duration: 1 })
        .to(videoBox.current, { ...s.corner, ease: 'power4.in', duration: 1 })
        .call(() => window.dispatchEvent(new CustomEvent('video:docked')))
        .to('.intro-bg', { backgroundColor: '#ffffff', ease: 'none', duration: 2 })
    })

    const onRefresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onRefresh)
    return () => { window.removeEventListener('resize', onRefresh); mm.revert() }
  }, { dependencies: [ratio], scope: root })

  useEffect(() => {
    const v = videoEl.current
    if (!v) return
    const unlock = () => {
      v.muted = false
      setMuted(false)
      v.play().then(() => {
        if (v.muted === false) {
          window.removeEventListener('click', unlock)
          window.removeEventListener('keydown', unlock)
          window.removeEventListener('touchstart', unlock)
        }
      }).catch(() => { v.muted = true; setMuted(true) })
    }
    window.addEventListener('click', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', unlock)

    const onDocked = () => setDocked(true)
    const onUndocked = () => setDocked(false)
    window.addEventListener('video:docked', onDocked)
    window.addEventListener('video:undocked', onUndocked)

    const stop = () => v.pause()
    const resume = () => v.play().catch(() => { })
    window.addEventListener('video:stop', stop)
    window.addEventListener('video:resume', resume)

    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('video:docked', onDocked)
      window.removeEventListener('video:undocked', onUndocked)
      window.removeEventListener('video:stop', stop)
      window.removeEventListener('video:resume', resume)
    }
  }, [isMobile])

  const toggleMute = () => {
    const v = videoEl.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  if (isMobile) {
    return (
      <section ref={root} className="relative overflow-x-hidden">
        <div
          className="fixed top-0 left-0 w-full z-20 overflow-hidden bg-black"
          style={{ aspectRatio: ratio || '16 / 9' }}
        >
          <video
            key="mobile"
            ref={videoEl}
            onLoadedMetadata={(e) => setRatio(e.target.videoWidth / e.target.videoHeight)}
            className="w-full h-full object-cover block"
            autoPlay muted loop playsInline
          >
            <source src={videoAddMobile} type="video/mp4" />
          </video>
        </div>

        {/* spacer reserving the video's height so flow starts below it */}
        <div className="w-full" style={{ aspectRatio: ratio || '16 / 9' }} />

        {/* logo, normal flow, scrolls away with the page */}
        <div className="relative w-full flex z-10 items-center justify-center overflow-x-hidden">
          <img
            src={logo}
            alt="Zyro"
            draggable="false"
            className="intro-logo w-[80vw] h-auto object-contain select-none"
          />
        </div>
      </section>
    )
  }

  return (
    <section ref={root} className="h-[250vh] z-20">
      <div className="intro-bg fixed inset-0 bg-white" />
      <div className="intro-word fixed inset-0 z-[15] flex items-center justify-center select-none pointer-events-none">
        <img
          src={logo}
          alt="Zyro"
          draggable="false"
          className="intro-logo w-[95vw] md:w-[70vw] h-auto object-contain"
        />
      </div>
      <div
        ref={videoBox}
        className="fixed z-20 overflow-hidden shadow-2xl bg-neutral-800 pointer-events-none"
        style={{ width: '60vw', height: '34vw', left: '20vw', top: '100vh' }}
      >
        <video
          key="desktop"
          id='addvid'
          ref={videoEl}
          onLoadedMetadata={(e) => setRatio(e.target.videoWidth / e.target.videoHeight)}
          className="h-full w-full object-cover"
          autoPlay muted loop playsInline
        >
          <source src={videoAdd} type="video/mp4" />
        </video>
        {docked && (
          <button
            onClick={toggleMute}
            className="cursor-pointer absolute bottom-2 right-2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur text-white pointer-events-auto"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}
      </div>
    </section>
  )
}