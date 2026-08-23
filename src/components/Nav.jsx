import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from "../assets/branding/logo.avif"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Nav() {
  const nav = useRef(null)

  useGSAP(() => {
    gsap.to(nav.current, {
      backgroundColor: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(8px)',
      duration: 0.3,
      scrollTrigger: {
        trigger: document.body,
        start: '90vh top',
        toggleActions: 'play none none reverse',
      },
    })

    const show = () => gsap.to(nav.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' })
    const hide = () => gsap.to(nav.current, { yPercent: -100, duration: 0.4, ease: 'power2.out' })

    let hidden = false
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (self.scroll() < 100) {
          if (hidden) { show(); hidden = false }
          return
        }
        if (self.direction === 1 && !hidden) { hide(); hidden = true }
        else if (self.direction === -1 && hidden) { show(); hidden = false }
      },
    })
  }, { scope: nav })

  return (
    <nav
      ref={nav}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[6rem] pt-5 will-change-transform"
    >
      <span className="text-ink text-2xl font-display tracking-tight"><img className='w-[10rem]' src={logo} alt="Zyro" /></span>
      <div className="hidden md:flex gap-8 text-ink-soft text-sm uppercase tracking-widest">
        <a href="#">Shop</a>
        <a href="#">Philosophy</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  )
}