import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { flavors } from '../data/flavors'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function FlavorGrid() {
  const root = useRef(null)

  useGSAP(() => {
    gsap.set('.flavor-card', { autoAlpha: 0, y: 80 })

    ScrollTrigger.batch('.flavor-card', {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, overwrite: true }),
    })

    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      onEnter: () => window.dispatchEvent(new CustomEvent('video:stop')),
      onLeaveBack: () => window.dispatchEvent(new CustomEvent('video:resume')),
    })
  }, { scope: root })

  return (
    <section ref={root} className="relative z-30 bg-base py-20 md:py-32 px-5 md:px-6">
      <h2 className="text-ink text-3xl md:text-6xl font-display text-center mb-12 md:mb-20 tracking-tight">
        The Full Lineup
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 max-w-7xl mx-auto">
        {flavors.map((f) => (
          <div
            key={f.name}
            className="flavor-card rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col items-center"
            style={{ backgroundColor: f.bg }}
          >
            <img
              src={f.can}
              alt={f.name}
              className="h-48 md:h-64 object-contain drop-shadow-xl"
            />
            <p className="text-ink-soft uppercase tracking-[0.2em] text-xs mt-6">
              {f.sub}
            </p>
            <h3 className="text-ink text-2xl md:text-2xl font-display mt-2 tracking-tight">
              {f.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  )
}