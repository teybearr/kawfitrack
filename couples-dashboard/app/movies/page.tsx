"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Movie = {
  id: string;
  name: string;
  genre: string;
  watched: boolean;
  date: string;
};

const GENRES = [
  "Action","Comedy","Drama","Horror",
  "Sci-Fi","Romance","Thriller","Animation","Fantasy","Disney",
];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [genre, setGenre] = useState("Action");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  // Load movies from Supabase on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    setLoading(true);
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMovies(data);
    setLoading(false);
  }

  async function addMovie() {
    if (!nameInput.trim()) return;
    const newMovie = {
      name: nameInput.trim(),
      genre,
      watched: false,
      date: new Date().toLocaleDateString(),
    };
    const { data, error } = await supabase
      .from("movies")
      .insert(newMovie)
      .select()
      .single();
    if (!error && data) setMovies((prev) => [data, ...prev]);
    setNameInput("");
  }

  async function toggleWatched(id: string) {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;
    const { error } = await supabase
      .from("movies")
      .update({ watched: !movie.watched })
      .eq("id", id);
    if (!error)
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m))
      );
  }

  async function deleteMovie(id: string) {
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (!error) setMovies((prev) => prev.filter((m) => m.id !== id));
  }

  async function saveEdit(id: string) {
    const { error } = await supabase
      .from("movies")
      .update({ name: editingName })
      .eq("id", id);
    if (!error)
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? { ...m, name: editingName } : m))
      );
    setEditingId(null);
  }

  async function clearAll() {
    if (!confirm("Delete all movies?")) return;
    const { error } = await supabase.from("movies").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (!error) setMovies([]);
  }

  const filtered = useMemo(() => {
    let list = [...movies];
    if (search) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.genre.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sort === "nameAsc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "nameDesc") list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "genre") list.sort((a, b) => a.genre.localeCompare(b.genre));
    return list;
  }, [movies, search, sort]);

  const toWatch = filtered.filter((m) => !m.watched);
  const watched = filtered.filter((m) => m.watched);

  return (
    <main className="min-h-screen px-6 py-12 relative overflow-hidden">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-periwinkle opacity-10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blush opacity-10 blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">

        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-cream transition-colors mb-8 font-dm text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          back home
        </Link>

        <div className="mb-8">
          <p className="font-caveat text-periwinkle text-lg mb-1">🎬 our watchlist</p>
          <h1 className="font-playfair text-4xl text-cream">Movies We've Watched</h1>
          <p className="font-dm text-muted text-sm mt-2">
            {movies.length} total · {movies.filter(m => !m.watched).length} to watch · {movies.filter(m => m.watched).length} watched
          </p>
        </div>

        {/* Add movie */}
        <div className="bg-dusk border border-periwinkle/20 rounded-2xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              className="flex-1 bg-velvet border border-white/10 rounded-xl px-4 py-3 text-cream font-dm text-sm outline-none focus:border-periwinkle/50 transition-colors placeholder:text-muted"
              placeholder="Add a movie..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMovie()}
            />
            <select
              className="bg-velvet border border-white/10 rounded-xl px-4 py-3 text-cream font-dm text-sm outline-none focus:border-periwinkle/50 transition-colors"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <button
              onClick={addMovie}
              className="bg-periwinkle text-velvet font-dm font-semibold text-sm px-5 py-3 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all"
            >
              Add
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 bg-velvet border border-white/10 rounded-xl px-4 py-2.5 text-cream font-dm text-sm outline-none focus:border-periwinkle/50 transition-colors placeholder:text-muted"
              placeholder="Search by name or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="bg-velvet border border-white/10 rounded-xl px-4 py-2.5 text-cream font-dm text-sm outline-none focus:border-periwinkle/50 transition-colors"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort</option>
              <option value="nameAsc">Name (A–Z)</option>
              <option value="nameDesc">Name (Z–A)</option>
              <option value="genre">Genre</option>
            </select>
            <button
              onClick={clearAll}
              className="bg-dusk-light border border-white/10 text-muted hover:text-cream font-dm text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              Clear All
            </button>
          </div>
        </div>

        {loading ? (
          <p className="font-caveat text-muted text-center text-lg py-12">loading our movies... 🎬</p>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="font-caveat text-blush text-xl mb-3">🐇 To Watch</h2>
              {toWatch.length === 0 ? (
                <p className="font-dm text-muted text-sm text-center py-6">No movies yet 🎬</p>
              ) : (
                <ul className="space-y-3">
                  {toWatch.map((m) => (
                    <MovieCard
                      key={m.id} movie={m}
                      editingId={editingId} editingName={editingName}
                      setEditingId={setEditingId} setEditingName={setEditingName}
                      onToggle={toggleWatched} onDelete={deleteMovie} onSaveEdit={saveEdit}
                      accent="blush"
                    />
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="font-caveat text-periwinkle text-xl mb-3">🦖 Watched</h2>
              {watched.length === 0 ? (
                <p className="font-dm text-muted text-sm text-center py-6">Nothing watched yet 👀</p>
              ) : (
                <ul className="space-y-3">
                  {watched.map((m) => (
                    <MovieCard
                      key={m.id} movie={m}
                      editingId={editingId} editingName={editingName}
                      setEditingId={setEditingId} setEditingName={setEditingName}
                      onToggle={toggleWatched} onDelete={deleteMovie} onSaveEdit={saveEdit}
                      accent="periwinkle"
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

      </div>
    </main>
  );
}

function MovieCard({
  movie, editingId, editingName, setEditingId, setEditingName,
  onToggle, onDelete, onSaveEdit, accent,
}: {
  movie: Movie;
  editingId: string | null;
  editingName: string;
  setEditingId: (id: string | null) => void;
  setEditingName: (name: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string) => void;
  accent: "blush" | "periwinkle";
}) {
  const isBlush = accent === "blush";
  const isEditing = editingId === movie.id;

  return (
    <li className={`
      bg-dusk border rounded-xl p-4 flex items-center justify-between gap-4
      hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200
      ${isBlush ? "border-blush/10 hover:border-blush/30" : "border-periwinkle/10 hover:border-periwinkle/30"}
    `}>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {isEditing ? (
          <input
            className="bg-velvet border border-periwinkle/40 rounded-lg px-3 py-1.5 text-cream font-dm text-sm outline-none"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit(movie.id)}
            autoFocus
          />
        ) : (
          <span className={`font-dm text-sm font-medium truncate ${movie.watched ? "line-through text-muted" : "text-cream"}`}>
            {movie.name}
          </span>
        )}
        <span className="font-caveat text-muted text-xs">
          🎭 {movie.genre} · Added: {movie.date}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isEditing ? (
          <button
            onClick={() => onSaveEdit(movie.id)}
            className="text-xs bg-periwinkle text-velvet px-3 py-1.5 rounded-lg font-dm font-semibold hover:opacity-90 transition-all"
          >
            Save
          </button>
        ) : (
          <>
            <button
              onClick={() => onToggle(movie.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-dm font-medium transition-all hover:opacity-90
                ${isBlush ? "bg-blush/10 text-blush hover:bg-blush/20" : "bg-periwinkle/10 text-periwinkle hover:bg-periwinkle/20"}`}
            >
              {movie.watched ? "🐇 Move Back" : "🦖 Watched"}
            </button>
            <button
              onClick={() => { setEditingId(movie.id); setEditingName(movie.name); }}
              className="text-muted hover:text-cream transition-colors text-sm px-2 py-1.5"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(movie.id)}
              className="text-muted hover:text-blush transition-colors text-sm px-2 py-1.5"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </li>
  );
}