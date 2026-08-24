import logo from "../assets/branding/logo.avif"


export default function Footer() {
  return (
    <footer className="relative z-30 bg-base text-ink px-8 pt-10 pb-20 border-t-2 border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-sm">
          <img className="w-[15rem]" src={logo} alt="" />
          <p className="text-ink mt-4 tracking-wider leading-relaxed">
            Nothing unnecessary. Zero sugar, zero calories. A choice you can
            make for taste, guilt free.
          </p>
        </div>
        <div className="flex gap-16 font-bold">
          <div className="flex flex-col gap-3 [&>*+*]:text-sm [&>*+*]:pl-2">
            <span className="text-ink uppercase tracking-widest text-md mb-2">Shop</span>
            <a href="#">Energy Pop</a>
            <a href="#">Indie Pop</a>
            <a href="#">Hydrate+</a>
            <a href="#">Skinny Pop</a>
          </div>
          <div className="flex flex-col gap-3 font-bold [&>*+*]:text-sm [&>*+*]:pl-2">
            <span className="text-ink uppercase tracking-widest text-md mb-2">About</span>
            <a href="#">Philosophy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}