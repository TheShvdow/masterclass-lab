"use client";
import { useState } from "react";
import { Metric } from "@/components/Metric";

type Result = { rows: number; queries: number; ms: number; sample: { name: string; posts: { title: string }[] }[] };

function Runner({ variant }: { variant: "vibe" | "pro" }) {
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    setRes(await (await fetch(`/api/lab3/${variant}`)).json());
    setBusy(false);
  };
  const vibe = variant === "vibe";
  return (
    <section className={`panel ${variant}`}>
      <h2>{vibe ? "Vibe codeur" : "Développeur augmenté"}</h2>
      <p className="who">{vibe ? "Une boucle for avec un await dedans" : "Une jointure (include) + pagination"}</p>
      <pre className="code">
        {vibe
          ? `const users = await db.user.findMany()
for (const u of users) {
  u.posts = await db.post.findMany({
    where: { authorId: u.id }
  })
}`
          : `const users = await db.user.findMany({
  include: { posts: true },
  take: 20,
  skip: (page - 1) * 20,
})`}
      </pre>
      <div style={{ marginTop: 16 }}>
        <button onClick={run} disabled={busy}>{busy ? "Exécution…" : "Exécuter"}</button>
      </div>
      {res && (
        <div className="metrics">
          <Metric value={res.queries} label="requêtes SQL" tone={vibe ? "bad" : "good"} />
          <Metric value={`${res.ms} ms`} label="temps serveur" tone={vibe ? "bad" : "good"} />
          <Metric value={res.rows} label="utilisateurs renvoyés" />
        </div>
      )}
    </section>
  );
}

export default function Lab3() {
  return (
    <>
      <h1>Lab 3 — Le piège des requêtes N+1</h1>
      <p className="lede">
        Afficher des utilisateurs avec leurs articles. Le code généré « marche » dans les deux cas : regarde le nombre
        de requêtes envoyées à la base de données.
      </p>
      <div className="split">
        <Runner variant="vibe" />
        <Runner variant="pro" />
      </div>
      <p className="note">
        Sur une base distante ou une connexion lente, chaque requête ajoute de la latence : 301 allers-retours au lieu
        de 2, c&apos;est la différence entre une page instantanée et une page qui rame.
      </p>
    </>
  );
}
