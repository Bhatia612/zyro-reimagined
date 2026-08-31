import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X } from 'lucide-react'
import logo from "../assets/branding/logo.avif"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Nav() {
  const nav = useRef(null)
  const menu = useRef(null)
  const [open, setOpen] = useState(false)

  useGSAP(() => {
    gsap.to(nav.current, {
      backgroundColor: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(8px)',
      duration: 0.3,
      scrollTrigger: {
        trigger: document.body,
        start: '800vh top',
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
        if (self.scroll() < window.innerHeight * 4) {
          show()
          hidden = false
          return
        }
        if (self.direction === 1 && !hidden) { hide(); hidden = true }
        else if (self.direction === -1 && hidden) { show(); hidden = false }
      },
    })
  }, { scope: nav })

  useGSAP(() => {
    if (!menu.current) return
    gsap.to(menu.current, {
      height: open ? 'auto' : 0,
      opacity: open ? 1 : 0,
      duration: 0.4,
      ease: 'power3.inOut',
    })
  }, { dependencies: [open] })

  return (
    <nav
      ref={nav}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-[6rem] py-4 md:pt-5 will-change-transform"
    >
      <span className="text-ink font-display tracking-tight">
        <img className="w-[7rem] md:w-[10rem]" src={logo} alt="Zyro" />
      </span>

      <div className="hidden md:flex gap-8 text-ink-soft text-sm uppercase tracking-widest">
        <a href="#">Shop</a>
        <a href="#">Philosophy</a>
        <a href="#">Contact</a>
      </div>

      <button
        className="md:hidden text-ink pointer-events-auto"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        ref={menu}
        className="md:hidden absolute top-full left-0 w-full bg-base backdrop-blur flex flex-col overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="py-8 px-6 flex flex-col gap-6 text-ink-soft text-sm uppercase tracking-widest">
          <a href="#" onClick={() => setOpen(false)}>Shop</a>
          <a href="#" onClick={() => setOpen(false)}>Philosophy</a>
          <a href="#" onClick={() => setOpen(false)}>Contact</a>
        </div>
      </div>
    </nav>
  )
}