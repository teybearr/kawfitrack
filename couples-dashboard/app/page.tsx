import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const navItems = [
  {
    href: "/dates",
    label: "places we've been",
    sublabel: "our favorite spots",
    emoji: "📍",
    accent: "blush",
    fallback: ["coffee dates", "late night drives", "spontaneous trips"],
  },
  {
    href: "/movies",
    label: "movies we've watched",
    sublabel: "our watchlist",
    emoji: "🎬",
    accent: "periwinkle",
    fallback: ["rom-coms", "thrillers", "rewatches"],
  },
];

const polaroids = [
  { src: "/photos/photo1.jpg", caption: "02.20.26", rotate: "-6deg", top: "6%", left: "2%" },
  { src: "/photos/photo2.jpg", caption: "02.13.26", rotate: "5deg", top: "4%", right: "3%" },
  { src: "/photos/photo3.jpg", caption: "02.05.26", rotate: "-4deg", top: "42%", left: "1%" },
  { src: "/photos/photo4.jpg", caption: "02.13.26", rotate: "6deg", top: "40%", right: "2%" },
  { src: "/photos/photo5.jpg", caption: "02.10.26", rotate: "-3deg", bottom: "6%", left: "3%" },
  { src: "/photos/photo6.jpg", caption: "01.29.26", rotate: "4deg", bottom: "5%", right: "3%" },
];

export default async function Home() {
  const [{ data: favPlaces }, { data: favMovies }] = await Promise.all([
    supabase.from("places").select("name").eq("is_favorite", true).limit(3),
    supabase.from("movies").select("name").eq("is_favorite", true).limit(3),
  ]);

  const placeTracks = favPlaces && favPlaces.length > 0
    ? favPlaces.map((p) => p.name)
    : navItems[0].fallback;

  const movieTracks = favMovies && favMovies.length > 0
    ? favMovies.map((m) => m.name)
    : navItems[1].fallback;

  const tracks = [placeTracks, movieTracks];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blush opacity-10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-periwinkle opacity-10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blush-dim opacity-5 blur-[80px]" />
      </div>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {polaroids.map((p, i) => (
          <div
            key={i}
            className="absolute w-32 opacity-60"
            style={{
              top: (p as any).top,
              bottom: (p as any).bottom,
              left: (p as any).left,
              right: (p as any).right,
              transform: `rotate(${p.rotate})`,
            }}
          >
            <div className="bg-white p-2 pb-7 shadow-2xl shadow-black/40">
              <div className="relative w-full aspect-square overflow-hidden bg-dusk">
                <Image src={p.src} alt={p.caption} fill className="object-cover" />
              </div>
              <p className="text-center mt-1 text-[10px] text-black/60 leading-none"
                style={{ fontFamily: "Caveat, cursive" }}>
                {p.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-14 relative z-10">
        <p className="font-caveat text-blush text-xl mb-2 tracking-wide">✦ est. mar 2026 ✦</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-cream leading-tight mb-3">
          our little world
        </h1>
        <p className="font-dm text-muted text-sm tracking-widest">a space just for us</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
        {navItems.map((item, idx) => {
          const isBlush = item.accent === "blush";
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                group relative rounded-2xl p-6 cursor-pointer overflow-hidden
                bg-dusk border transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl
                ${isBlush
                  ? "border-blush/20 hover:border-blush/50 hover:shadow-blush/10"
                  : "border-periwinkle/20 hover:border-periwinkle/50 hover:shadow-periwinkle/10"
                }
              `}>
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl
                  ${isBlush ? "bg-gradient-to-br from-blush/5 to-transparent" : "bg-gradient-to-br from-periwinkle/5 to-transparent"}
                `} />

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="text-2xl mb-2 block">{item.emoji}</span>
                    <h2 className="font-playfair text-xl text-cream leading-snug">{item.label}</h2>
                    <p className="font-caveat text-sm mt-1"
                      style={{ color: isBlush ? "var(--color-blush)" : "var(--color-periwinkle)" }}>
                      {item.sublabel}
                    </p>
                  </div>
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                    transition-all duration-300
                    ${isBlush ? "bg-blush" : "bg-periwinkle"}
                  `}>
                    <svg className="w-4 h-4 text-velvet ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                  {tracks[idx].map((track, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-dm text-muted text-xs w-3">{i + 1}</span>
                      <div className={`w-1 h-1 rounded-full ${isBlush ? "bg-blush/40" : "bg-periwinkle/40"}`} />
                      <span className="font-caveat text-cream/50 text-sm truncate">{track}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="font-caveat text-muted text-sm mt-14 relative z-10">🌀🎀</p>
    </main>
  );
}