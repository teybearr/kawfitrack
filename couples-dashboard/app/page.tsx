import Link from "next/link";

const navItems = [
  {
    href: "/dates",
    label: "places we've been",
    sublabel: "our favorite spots",
    emoji: "📍",
    accent: "blush",
    tracks: ["coffee shop dates", "late night drives", "spontaneous trips"],
  },
  {
    href: "/movies",
    label: "movies we've watched",
    sublabel: "our watchlist & reviews",
    emoji: "🎬",
    accent: "periwinkle",
    tracks: ["rom-coms", "thrillers", "rewatches"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blush opacity-10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-periwinkle opacity-10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blush-dim opacity-5 blur-[80px]" />
      </div>

      {/* Header */}
      <div className="text-center mb-14 relative z-10">
        <p className="font-caveat text-blush text-xl mb-2 tracking-wide">
          ✦ est. 12/15/25 ✦
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl text-cream leading-tight mb-3">
          🐇 our little world 🦖
        </h1>
        <p className="font-dm text-muted text-sm tracking-widest uppercase">
          -- our space --
        </p>
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
        {navItems.map((item) => {
          const isBlush = item.accent === "blush";
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`
                  group relative rounded-2xl p-6 cursor-pointer overflow-hidden
                  bg-dusk border transition-all duration-300
                  hover:-translate-y-1 hover:shadow-2xl
                  ${isBlush
                    ? "border-blush/20 hover:border-blush/50 hover:shadow-blush/10"
                    : "border-periwinkle/20 hover:border-periwinkle/50 hover:shadow-periwinkle/10"
                  }
                `}
              >
                {/* Card glow on hover */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl
                    ${isBlush
                      ? "bg-gradient-to-br from-blush/5 to-transparent"
                      : "bg-gradient-to-br from-periwinkle/5 to-transparent"
                    }
                  `}
                />

                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="text-2xl mb-2 block">{item.emoji}</span>
                    <h2 className="font-playfair text-xl text-cream leading-snug">
                      {item.label}
                    </h2>
                    <p className="font-caveat text-sm mt-1"
                      style={{ color: isBlush ? "var(--color-blush)" : "var(--color-periwinkle)" }}>
                      {item.sublabel}
                    </p>
                  </div>
                  {/* Spotify-style play button */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                      transition-all duration-300
                      ${isBlush ? "bg-blush" : "bg-periwinkle"}
                    `}
                  >
                    <svg className="w-4 h-4 text-velvet ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Fake "track list" */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  {item.tracks.map((track, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-dm text-muted text-xs w-3">{i + 1}</span>
                      <div className={`w-1 h-1 rounded-full ${isBlush ? "bg-blush/40" : "bg-periwinkle/40"}`} />
                      <span className="font-caveat text-cream/50 text-sm">{track}</span>
                    </div>
                  ))}
                </div>

              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <p className="font-caveat text-muted text-sm mt-14 relative z-10">
        made with love 🎀
      </p>

    </main>
  );
}