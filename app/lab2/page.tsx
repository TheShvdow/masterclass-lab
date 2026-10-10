"use client";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type Product = { id: number; name: string };
const fakeApi = () =>
  new Promise<Product[]>((resolve) =>
    setTimeout(() => resolve([{ id: 1, name: "Casque Pro" }, { id: 2, name: "Laptop Max" }, { id: 3, name: "Enceinte Smart" }]), 1200)
  );

/* ---------- Bug 1 : .map() sur undefined ---------- */
function ProductsVibe() {
  const [products, setProducts] = useState<Product[]>(); // ❌ pas de valeur initiale → undefined
  useEffect(() => {
    fakeApi().then(setProducts);
  }, []);
  // @ts-expect-error — le code généré ignore l'avertissement de TypeScript
  return <ul className="list">{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}

function ProductsPro() {
  const [products, setProducts] = useState<Product[]>([]); // ✅ tableau vide par défaut
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fakeApi().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);
  if (loading) return <p className="note">Chargement des produits…</p>;
  return <ul className="list">{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}

/* ---------- Bug 2 : Unexpected token '<' ---------- */
async function loadStatsVibe(broken: boolean) {
  const res = await fetch(`/api/lab2/stats?broken=${broken ? 1 : 0}`);
  return res.json(); // ❌ on suppose que la réponse est toujours du JSON
}

async function loadStatsPro(broken: boolean) {
  const res = await fetch(`/api/lab2/stats?broken=${broken ? 1 : 0}`);
  const type = res.headers.get("content-type") ?? "";
  // ✅ on vérifie le statut et le format avant de parser
  if (!res.ok || !type.includes("application/json")) {
    const body = await res.text();
    throw new Error(`Le serveur a répondu ${res.status} avec du ${type.split(";")[0] || "contenu inconnu"} au lieu de JSON. Début de la réponse : ${body.slice(0, 60)}…`);
  }
  return res.json();
}

function StatsCard({ title, loader, broken }: { title: string; loader: (b: boolean) => Promise<unknown>; broken: boolean }) {
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const run = () =>
    loader(broken)
      .then((d) => setResult({ ok: true, text: JSON.stringify(d) }))
      .catch((e: Error) => setResult({ ok: false, text: `${e.name}: ${e.message}` }));
  return (
    <div>
      <button onClick={run}>{title}</button>
      {result && <div className={`${result.ok ? "success" : "error"} mono`}>{result.text}</div>}
    </div>
  );
}

export default function Lab2() {
  const [runId, setRunId] = useState(0);
  const [broken, setBroken] = useState(true);

  return (
    <>
      <h1>Lab 2 — Déboguer avec ou sans comprendre</h1>
      <p className="lede">Deux erreurs que tout vibe codeur rencontre. Le but : lire le message et trouver la cause en direct.</p>

      <h2>Erreur 1 : « Cannot read properties of undefined (reading &apos;map&apos;) »</h2>
      <button onClick={() => setRunId(runId + 1)}>Relancer les deux composants</button>
      <div className="split" style={{ marginTop: 16 }}>
        <section className="panel vibe">
          <h2>Vibe codeur</h2>
          <p className="who">useState() sans valeur initiale</p>
          <ErrorBoundary key={`v${runId}`}>
            <ProductsVibe />
          </ErrorBoundary>
        </section>
        <section className="panel pro">
          <h2>Développeur augmenté</h2>
          <p className="who">useState([]) + état de chargement</p>
          <ProductsPro key={`p${runId}`} />
        </section>
      </div>

      <h2 style={{ marginTop: 40 }}>Erreur 2 : « Unexpected token &apos;&lt;&apos; … is not valid JSON »</h2>
      <label className="row" style={{ alignItems: "center", width: "fit-content" }}>
        <input type="checkbox" style={{ width: 20 }} checked={broken} onChange={(e) => setBroken(e.target.checked)} />
        Simuler une panne de l&apos;API (réponse 500 en HTML)
      </label>
      <div className="split" style={{ marginTop: 16 }}>
        <section className="panel vibe">
          <h2>Vibe codeur</h2>
          <p className="who">res.json() sans vérification</p>
          <StatsCard title="Charger les statistiques" loader={loadStatsVibe} broken={broken} />
        </section>
        <section className="panel pro">
          <h2>Développeur augmenté</h2>
          <p className="who">Vérifie le statut et le format avant de parser</p>
          <StatsCard title="Charger les statistiques" loader={loadStatsPro} broken={broken} />
        </section>
      </div>
    </>
  );
}
