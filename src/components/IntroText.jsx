import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const lines = [
    [{ t: 'ZERO' }, { t: 'SUGAR', hl: true }],
    [{ t: 'ZERO' }, { t: 'CALORIES', hl: true }],
    [{ t: 'NOTHING' }],
    [{ t: 'UNNECESSARY', hl: true }],
]

export default function IntroText() {
    const root = useRef(null)
    const panel = useRef(null)

    useGSAP(() => {
        gsap.set(panel.current, { yPercent: 100 })

        const raise = () => gsap.to(panel.current, { yPercent: 0, duration: 0.6, ease: 'power3.inOut', overwrite: true })
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


        gsap.set('.line-0', { autoAlpha: 1, yPercent: 0 })

        lines.forEach((words, i) => {
            if (i !== 0) {
                tl.fromTo(
                    `.line-${i}`,
                    { autoAlpha: 0, yPercent: 60 },
                    { autoAlpha: 1, yPercent: 0, ease: 'power3.out' }
                )
            }
            words.forEach((w, j) => {
                if (w.hl) {
                    tl.to(
                        `.word-${i}-${j}`,
                        { color: 'var(--color-ink-soft)', duration: 0.4, ease: 'power2.out' },
                        '<0.2'
                    )
                }
            })
            tl.to(`.line-${i}`, { autoAlpha: 0, yPercent: -60, ease: 'power3.in' })
        })

        return () => {
            window.removeEventListener('video:docked', raise)
            window.removeEventListener('video:undocked', drop)
        }
    }, { scope: root })

    return (
        <section ref={root} className="h-[300vh] relative z-10 font-[800]">
            <div className="introtext-stage h-screen w-full overflow-hidden">
                <div ref={panel} className="absolute inset-0 bg-base z-0" />
                <div className="relative z-10 h-full w-full flex items-center justify-center">
                    {lines.map((words, i) => (
                        <h2
                            key={i}
                            className={`line-${i} absolute flex gap-4 flex-wrap justify-center font-display text-[12vw] md:text-[9vw] tracking-tighter text-center px-6`}
                        >
                            {words.map((w, j) => (
                                <span key={j} className="relative inline-block px-2">
                                    <span className={w.hl ? `word-${i}-${j} text-ink` : 'text-ink'}>{w.t}</span>
                                </span>
                            ))}
                        </h2>
                    ))}
                </div>
            </div>
        </section>
    )
}