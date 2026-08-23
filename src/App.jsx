import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  const sections = [
    { name: 'Masala Cola', bg: '#5b2d1b' },
    { name: 'Blue Bolt', bg: '#0a4ea3' },
    { name: 'Green Apple', bg: '#3a7d1e' },
    { name: 'Lime & Lemon', bg: '#c7d11a' },
  ]

  return (
    <main>
      {sections.map((s) => (
        <section
          key={s.name}
          style={{ backgroundColor: s.bg }}
          className="h-screen flex items-center justify-center"
        >
          <h1 className="text-6xl font-black text-white tracking-tight">
            {s.name}
          </h1>
        </section>
      ))}
    </main>
  )
}