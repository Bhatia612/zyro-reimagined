import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const items = ['ZERO SUGAR', 'ZERO CALORIES', 'NOTHING UNNECESSARY']

export default function Marquee() {
  const track = useRef(null)

  useGSAP(() => {
    const loop = gsap.to(track.current, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: 'none',
    })

    let current = 1
    ScrollTrigger.create({
      trigger: track.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const dir = self.direction
        const speed = 1 + Math.abs(self.getVelocity() / 2000)
        gsap.to(loop, { timeScale: dir * speed, overwrite: true })
        current = dir
      },
    })
  }, { scope: track })

  const row = [...items, ...items, ...items, ...items]

  return (
    <section className="bg-black py-8 overflow-hidden">
      <div ref={track} className="flex whitespace-nowrap w-max">
        {row.map((text, i) => (
          <span
            key={i}
            className="text-white text-6xl md:text-8xl font-black uppercase px-8 tracking-tight"
          >
            {text}
            <span className="text-white/30 px-8">/</span>
          </span>
        ))}
      </div>
    </section>
  )
}