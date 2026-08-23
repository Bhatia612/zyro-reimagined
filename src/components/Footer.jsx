export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-sm">
          <span className="text-3xl font-black tracking-tight">ZYRO</span>
          <p className="text-white/60 mt-4 leading-relaxed">
            Nothing unnecessary. Zero sugar, zero calories. A choice you can
            make for taste, guilt free.
          </p>
        </div>
        <div className="flex gap-16 text-sm">
          <div className="flex flex-col gap-3 text-white/80">
            <span className="text-white/40 uppercase tracking-widest text-xs mb-2">Shop</span>
            <a href="#">Energy Pop</a>
            <a href="#">Indie Pop</a>
            <a href="#">Hydrate+</a>
            <a href="#">Skinny Pop</a>
          </div>
          <div className="flex flex-col gap-3 text-white/80">
            <span className="text-white/40 uppercase tracking-widest text-xs mb-2">About</span>
            <a href="#">Philosophy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}