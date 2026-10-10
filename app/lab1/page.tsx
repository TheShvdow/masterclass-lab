"use client";
import { useEffect, useState } from "react";
import { Metric } from "@/components/Metric";

type VibeProduct = { id: number; name: string; price: number; category: { name: string } };
type ProResponse = { items: VibeProduct[]; total: number; page: number; pages: number; queries: number; ms: number };

const CATEGORIES = ["Téléphones", "Ordinateurs", "Audio", "Maison", "Mode", "Beauté", "Sport", "Alimentation"];
const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
const kb = (bytes: number) => `${Math.round(bytes / 1024).toLocaleString("fr-FR")} Ko`;

/* ---------- Version vibe codeur ---------- */
function VibePanel() {
  const [all, setAll] = useState<VibeProduct[]>([]);
  const [q, setQ] = useState("");
  const [stats, setStats] = useState({ ms: 0, bytes: 0 });

  useEffect(() => {
    const start = performance.now();
    fetch("/api/vibe/products")
      .then((r) => r.text())
      .then((text) => {
        setStats({ ms: Math.round(performance.now() - start), bytes: text.length });
        setAll(JSON.parse(text));
      });
  }, []);

  // Filtre recalculé sur 10 000 éléments à chaque frappe, et tout est affiché.
  const filtered = all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="panel vibe">
      <h2>Vibe codeur</h2>
      <p className="who">Prompt : « Ajoute un filtre à ma liste de produits »</p>
      <input placeholder="Rechercher un produit…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="metrics">
        <Metric value={stats.bytes ? kb(stats.bytes) : "…"} label="téléchargés" tone="bad" />
        <Metric value={stats.ms ? `${stats.ms} ms` : "…"} label="chargement initial" />
        <Metric value={filtered.length.toLocaleString("fr-FR")} label="lignes dans la page" tone="bad" />
      </div>
      <ul className="list">
        {filtered.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            <span className="mono">{fcfa(p.price)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Version dev augmenté ---------- */
function ProPanel() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProResponse | null>(null);
  const [bytes, setBytes] = useState(0);

  useEffect(() => setPage(1), [q, category]);

  useEffect(() => {
    // Debounce : on attend 300 ms après la dernière frappe avant d'appeler l'API.
    const t = setTimeout(() => {
      const params = new URLSearchParams({ q, page: String(page) });
      if (category) params.set("category", category);
      fetch(`/api/pro/products?${params}`)
        .then((r) => r.text())
        .then((text) => {
          setBytes(text.length);
          setData(JSON.parse(text));
        });
    }, 300);
    return () => clearTimeout(t);
  }, [q, category, page]);

  return (
    <section className="panel pro">
      <h2>Développeur augmenté</h2>
      <p className="who">Prompt : filtre côté serveur, validation, 20 résultats par page, debounce</p>
      <div className="row">
        <input placeholder="Rechercher un produit…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Catégorie">
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c, i) => (
            <option key={c} value={i + 1}>{c}</option>
          ))}
        </select>
      </div>
      <div className="metrics">
        <Metric value={bytes ? kb(bytes) : "…"} label="téléchargés" tone="good" />
        <Metric value={data ? `${data.ms} ms` : "…"} label="temps serveur" />
        <Metric value={data ? data.queries : "…"} label="requêtes SQL" />
        <Metric value={data ? data.items.length : "…"} label={`affichés sur ${data?.total.toLocaleString("fr-FR") ?? "…"}`} tone="good" />
      </div>
      <ul className="list">
        {data?.items.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            <span className="mono">{fcfa(p.price)}</span>
          </li>
        ))}
      </ul>
      {data && data.pages > 1 && (
        <div className="pager">
          <button className="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Page précédente</button>
          <span className="mono">{page} / {data.pages}</span>
          <button className="ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Page suivante</button>
        </div>
      )}
    </section>
  );
}

export default function Lab1() {
  return (
    <>
      <h1>Lab 1 — Un filtre sur 10 000 produits</h1>
      <p className="lede">
        Même besoin, deux prompts. Tape « casque » dans les deux champs et compare ce qui transite sur le réseau et ce
        que le navigateur doit afficher.
      </p>
      <div className="split">
        <VibePanel />
        <ProPanel />
      </div>
    </>
  );
}
