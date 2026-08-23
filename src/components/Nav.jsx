import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Nav() {
  const nav = useRef(null)

  useGSAP(() => {
    gsap.to(nav.current, {
      backgroundColor: 'rgba(10,10,10,0.8)',
      backdropFilter: 'blur(8px)',
      duration: 0.3,
      scrollTrigger: {
        trigger: document.body,
        start: '90vh top',
        toggleActions: 'play none none reverse',
      },
    })
  }, { scope: nav })

  return (
    <nav
      ref={nav}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-5"
    >
      <span className="text-white text-2xl font-black tracking-tight">ZYRO</span>
      <div className="hidden md:flex gap-8 text-white/90 text-sm uppercase tracking-widest">
        <a href="#">Shop</a>
        <a href="#">Philosophy</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  )
}