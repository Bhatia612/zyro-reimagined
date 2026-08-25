import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import videoAdd from "../assets/branding/add.mp4"
import { Volume2, VolumeX } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function IntroHero() {
  const root = useRef(null)
  const videoBox = useRef(null)
  const videoEl = useRef(null)
  const [docked, setDocked] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ratio, setRatio] = useState(null)

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

  function mobileSize(ratio) {
    const vw = window.innerWidth
    const w = vw * 0.9
    const h = w / ratio
    return { width: w, height: h, left: vw * 0.05, borderRadius: 8 }
  }

  useGSAP(() => {
    if (!ratio) return
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const s = sizes(ratio)
      gsap.set(videoBox.current, { ...s.full, top: window.innerHeight, autoAlpha: 1 })
      gsap.set('.intro-word', { autoAlpha: 1, yPercent: 0 })

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

    mm.add('(max-width: 767px)', () => {
      const m = mobileSize(ratio)
      const topStart = window.innerHeight * 0.5
      gsap.set(videoBox.current, { ...m, top: topStart, autoAlpha: 1 })
      gsap.set('.intro-word', { autoAlpha: 1, yPercent: -80 })
      gsap.set('.intro-bg', { backgroundColor: '#ffffff' })

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

      tl.to('.intro-word', { autoAlpha: 0, yPercent: -120, ease: 'power2.in', duration: 1 }, 0)
        .to(videoBox.current, { top: 72, ease: 'power2.inOut', duration: 1 }, 0)
        .call(() => window.dispatchEvent(new CustomEvent('video:docked')))
    })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); mm.revert() }
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
  }, [])

  const toggleMute = () => {
    const v = videoEl.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <section ref={root} className="h-[250vh]">
      <div className="intro-bg fixed inset-0 z-10 bg-white" />
      <h1 className="intro-word fixed inset-0 z-[15] flex items-center justify-center font-display text-ink text-[26vw] tracking-tighter leading-none select-none pointer-events-none">
        ZYRO
      </h1>
      <div
        ref={videoBox}
        className="fixed z-20 overflow-hidden shadow-2xl bg-neutral-800 pointer-events-none"
        style={{ width: '60vw', height: '34vw', left: '20vw', top: '100vh' }}
      >
        <video
          id='addvid'
          ref={videoEl}
          onLoadedMetadata={(e) => { setRatio(e.target.videoWidth / e.target.videoHeight) }}
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