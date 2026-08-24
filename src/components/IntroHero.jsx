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
      if (h > maxH) {
        h = maxH
        w = h * ratio
      }
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
    if (!ratio) return

    gsap.set(videoBox.current, sizes(ratio).full)

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

    tl.to(videoBox.current, { ...sizes(ratio).inset, ease: 'none', duration: 2 }, 0)
      .to({}, { duration: 1 })
      .to(videoBox.current, { ...sizes(ratio).corner, ease: 'power4.in', duration: 1 })
      .call(() => window.dispatchEvent(new CustomEvent('video:docked')))
      .to('.intro-bg', { backgroundColor: '#ffffff', ease: 'none', duration: 2 })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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
          window.removeEventListener('scroll', unlock)
          window.removeEventListener('mousemove', unlock)
          window.removeEventListener('wheel', unlock)
        }
      }).catch(() => { v.muted = true; setMuted(true) })
    }
    window.addEventListener('click', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', unlock)
    window.addEventListener('scroll', unlock)
    window.addEventListener('mousemove', unlock)
    window.addEventListener('wheel', unlock)

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
      window.removeEventListener('scroll', unlock)
      window.removeEventListener('mousemove', unlock)
      window.removeEventListener('wheel', unlock)
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
    <section ref={root} className="h-[200vh]">
      <div className="intro-bg fixed inset-0 z-10 bg-black" />
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