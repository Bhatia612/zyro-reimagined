import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const lines = ['NOTHING', 'UNNECESSARY', 'ZERO SUGAR', 'ZERO CALORIES']

export default function IntroText() {
    const root = useRef(null)
    const panel = useRef(null)

    useGSAP(() => {
        gsap.set(panel.current, { yPercent: 100 })

        const raise = () => gsap.to(panel.current, { yPercent: 0, duration: 0.6, ease: 'power3.inOut', delay: 0.25, overwrite: true })
        const drop = () => gsap.to(panel.current, { yPercent: 100, duration: 0.6, ease: 'power3.inOut', overwrite: true })

        window.addEventListener('video:docked', raise)
        window.addEventListener('video:undocked', drop)

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                pin: '.introtext-stage',
            },
        })

        tl.to({}, { duration: 0.4 })

        lines.forEach((_, i) => {
            tl.fromTo(
                `.line-${i}`,
                { autoAlpha: 0, yPercent: 60 },
                { autoAlpha: 1, yPercent: 0, ease: 'power3.out' }
            ).to(`.line-${i}`, { autoAlpha: 0, yPercent: -60, ease: 'power3.in' })
        })

        return () => {
            window.removeEventListener('video:docked', raise)
            window.removeEventListener('video:undocked', drop)
        }
    }, { scope: root })

    return (
        <section ref={root} className="h-[400vh] relative z-10">
            <div className="introtext-stage h-screen w-full overflow-hidden">
                <div ref={panel} className="absolute inset-0 bg-base z-0" />
                <div className="relative z-10 h-full w-full flex items-center justify-center">
                    {lines.map((text, i) => (
                        <h2
                            key={i}
                            className={`line-${i} absolute text-ink font-display text-[12vw] md:text-[9vw] tracking-tighter text-center px-6`}
                        >
                            {text}
                        </h2>
                    ))}
                </div>
            </div>
        </section>
    )
}