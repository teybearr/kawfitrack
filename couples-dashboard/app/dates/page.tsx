"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Place = {
  id: string;
  name: string;
  category: string[];
  visited: boolean;
  date: string;
};

const CATEGORIES = [
  "cafe", "restaurant", "museum", "nature",
  "food spot", "adventure", "activity",
];

export default function DatesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [visitedInput, setVisitedInput] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    setLoading(true);
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPlaces(data);
    setLoading(false);
  }

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function addPlace() {
    if (!nameInput.trim()) return;
    if (selectedCategories.length === 0) {
      alert("Please select at least one category!");
      return;
    }
    const newPlace = {
      name: nameInput.trim(),
      category: selectedCategories,
      visited: visitedInput,
      date: new Date().toLocaleDateString(),
    };
    const { data, error } = await supabase
      .from("places")
      .insert(newPlace)
      .select()
      .single();
    if (!error && data) setPlaces((prev) => [data, ...prev]);
    setNameInput("");
    setSelectedCategories([]);
  }

  async function toggleVisited(id: string) {
    const place = places.find((p) => p.id === id);
    if (!place) return;
    const { error } = await supabase
      .from("places")
      .update({ visited: !place.visited })
      .eq("id", id);
    if (!error)
      setPlaces((prev) =>
        prev.map((p) => (p.id === id ? { ...p, visited: !p.visited } : p))
      );
  }

  async function deletePlace(id: string) {
    const { error } = await supabase.from("places").delete().eq("id", id);
    if (!error) setPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  async function saveEdit(id: string) {
    const { error } = await supabase
      .from("places")
      .update({ name: editingName })
      .eq("id", id);
    if (!error)
      setPlaces((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: editingName } : p))
      );
    setEditingId(null);
  }

  async function clearAll() {
    if (!confirm("Delete all places?")) return;
    const { error } = await supabase.from("places").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (!error) setPlaces([]);
  }

  const filtered = useMemo(() => {
    let list = [...places];
    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.some((c) => c.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (sort === "nameAsc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "nameDesc") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [places, search, sort]);

  const toVisit = filtered.filter((p) => !p.visited);
  const visited = filtered.filter((p) => p.visited);

  return (
    <main className="min-h-screen px-6 py-12 relative overflow-hidden">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blush opacity-10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-periwinkle opacity-10 blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">

        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-cream transition-colors mb-8 font-dm text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          back home
        </Link>

        <div className="mb-8">
          <p className="font-caveat text-blush text-lg mb-1">📍 where have we been thooooo</p>
          <h1 className="font-playfair text-4xl text-cream">date places we've been</h1>
          <p className="font-dm text-muted text-sm mt-2">
            {places.length} total · {places.filter(p => !p.visited).length} to visit · {places.filter(p => p.visited).length} visited
          </p>
        </div>

        {/* Add place */}
        <div className="bg-dusk border border-blush/20 rounded-2xl p-5 mb-6">

          {/* Name + status + add button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              className="flex-1 bg-velvet border border-white/10 rounded-xl px-4 py-3 text-cream font-dm text-sm outline-none focus:border-blush/50 transition-colors placeholder:text-muted"
              placeholder="add a place ^_^"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlace()}
            />
            <select
              className="bg-velvet border border-white/10 rounded-xl px-4 py-3 text-cream font-dm text-sm outline-none focus:border-blush/50 transition-colors"
              value={visitedInput ? "true" : "false"}
              onChange={(e) => setVisitedInput(e.target.value === "true")}
            >
              <option value="false">📍 to visit</option>
              <option value="true">✅ visited</option>
            </select>
            <button
              onClick={addPlace}
              className="bg-blush text-velvet font-dm font-semibold text-sm px-5 py-3 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all"
            >
              add
            </button>
          </div>

          {/* Category pills */}
          <div className="mb-4">
            <p className="font-caveat text-muted text-sm mb-2">pick categories:</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`
                      px-3 py-1.5 rounded-full font-dm text-xs transition-all
                      ${active
                        ? "bg-blush text-velvet font-semibold"
                        : "bg-velvet border border-white/10 text-muted hover:border-blush/40 hover:text-cream"
                      }
                    `}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 bg-velvet border border-white/10 rounded-xl px-4 py-2.5 text-cream font-dm text-sm outline-none focus:border-blush/50 transition-colors placeholder:text-muted"
              placeholder="search by name or category ^_^"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="bg-velvet border border-white/10 rounded-xl px-4 py-2.5 text-cream font-dm text-sm outline-none focus:border-blush/50 transition-colors"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">sort</option>
              <option value="nameAsc">name (a–z)</option>
              <option value="nameDesc">name (z–a)</option>
            </select>
            <button
              onClick={clearAll}
              className="bg-dusk-light border border-white/10 text-muted hover:text-cream font-dm text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              clear all
            </button>
          </div>
        </div>

        {loading ? (
          <p className="font-caveat text-muted text-center text-lg py-12">loading our places... 📍</p>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="font-caveat text-blush text-xl mb-3">📍 to visit</h2>
              {toVisit.length === 0 ? (
                <p className="font-dm text-muted text-sm text-center py-6">no places to visit yet 🌍</p>
              ) : (
                <ul className="space-y-3">
                  {toVisit.map((p) => (
                    <PlaceCard
                      key={p.id} place={p}
                      editingId={editingId} editingName={editingName}
                      setEditingId={setEditingId} setEditingName={setEditingName}
                      onToggle={toggleVisited} onDelete={deletePlace} onSaveEdit={saveEdit}
                      accent="blush"
                    />
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="font-caveat text-periwinkle text-xl mb-3">✅ visited</h2>
              {visited.length === 0 ? (
                <p className="font-dm text-muted text-sm text-center py-6">no places visited yet ✈️</p>
              ) : (
                <ul className="space-y-3">
                  {visited.map((p) => (
                    <PlaceCard
                      key={p.id} place={p}
                      editingId={editingId} editingName={editingName}
                      setEditingId={setEditingId} setEditingName={setEditingName}
                      onToggle={toggleVisited} onDelete={deletePlace} onSaveEdit={saveEdit}
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

function PlaceCard({
  place, editingId, editingName, setEditingId, setEditingName,
  onToggle, onDelete, onSaveEdit, accent,
}: {
  place: Place;
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
  const isEditing = editingId === place.id;

  return (
    <li className={`
      bg-dusk border rounded-xl p-4 flex items-center justify-between gap-4
      hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200
      ${isBlush ? "border-blush/10 hover:border-blush/30" : "border-periwinkle/10 hover:border-periwinkle/30"}
    `}>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {isEditing ? (
          <input
            className="bg-velvet border border-blush/40 rounded-lg px-3 py-1.5 text-cream font-dm text-sm outline-none"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit(place.id)}
            autoFocus
          />
        ) : (
          <span className={`font-dm text-sm font-medium truncate ${place.visited ? "line-through text-muted" : "text-cream"}`}>
            {place.name}
          </span>
        )}
        {/* Category pills on card */}
        <div className="flex flex-wrap gap-1 mt-1">
          {(Array.isArray(place.category) ? place.category : [place.category]).map((cat) => (
            <span
              key={cat}
              className={`text-xs px-2 py-0.5 rounded-full
                ${isBlush ? "bg-blush/10 text-blush" : "bg-periwinkle/10 text-periwinkle"}`}
            >
              {cat}
            </span>
          ))}
        </div>
        <span className="font-caveat text-muted text-xs">added: {place.date}</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isEditing ? (
          <button
            onClick={() => onSaveEdit(place.id)}
            className="text-xs bg-blush text-velvet px-3 py-1.5 rounded-lg font-dm font-semibold hover:opacity-90 transition-all"
          >
            Save
          </button>
        ) : (
          <>
            <button
              onClick={() => onToggle(place.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-dm font-medium transition-all hover:opacity-90
                ${isBlush ? "bg-blush/10 text-blush hover:bg-blush/20" : "bg-periwinkle/10 text-periwinkle hover:bg-periwinkle/20"}`}
            >
              {place.visited ? "🐇 move back" : "🦖 visited"}
            </button>
            <button
              onClick={() => { setEditingId(place.id); setEditingName(place.name); }}
              className="text-muted hover:text-cream transition-colors text-sm px-2 py-1.5"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(place.id)}
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