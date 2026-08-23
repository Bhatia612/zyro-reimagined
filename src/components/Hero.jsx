import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { flavors } from '../data/flavors'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Hero() {
    const root = useRef(null)
    const canRef = useRef(null)
    const [active, setActive] = useState(0)

    useGSAP(() => {
        const steps = flavors.length

        const st = ScrollTrigger.create({
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            pin: '.hero-stage',
            scrub: 1,
            onUpdate: (self) => {
                const index = Math.min(
                    steps - 1,
                    Math.floor(self.progress * steps)
                )
                setActive(index)
            },
        })

        return () => st.kill()
    }, { scope: root })

    useGSAP(() => {
        gsap.to('.hero-stage', {
            backgroundColor: flavors[active].bg,
            duration: 0.6,
            ease: 'power2.out',
        })
        gsap.fromTo(
            canRef.current,
            { autoAlpha: 0, y: 40, scale: 0.92 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
        )
    }, { dependencies: [active], scope: root })

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.hero-stage p', { autoAlpha: 0, y: 20, duration: 0.6, delay: 0.2 })
            .from('.hero-stage img', { autoAlpha: 0, y: 60, scale: 0.9, duration: 0.8 }, '-=0.3')
            .from('.hero-stage h1', { autoAlpha: 0, y: 20, duration: 0.6 }, '-=0.4')
    }, { scope: root })

    return (
        <section ref={root} style={{ height: `${flavors.length * 100}vh` }}>
            <div className="hero-stage h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <p className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">
                    {flavors[active].sub}
                </p>
                <img
                    ref={canRef}
                    src={flavors[active].can}
                    alt={flavors[active].name}
                    className="h-[60vh] object-contain drop-shadow-2xl"
                />
                <h1 className="text-white text-5xl md:text-7xl font-black tracking-tight mt-6">
                    {flavors[active].name}
                </h1>
            </div>
        </section>
    )
}