"use client";
import { useState } from "react";

const PRESETS = [
  { label: "Identifiants corrects", email: "admin@gtech.sn", password: "Admin@2026" },
  { label: "Mauvais mot de passe", email: "admin@gtech.sn", password: "123456" },
  { label: "Injection SQL", email: "' OR 1=1 --", password: "nimportequoi" },
];

type Answer = { status: number; body: unknown } | null;

async function login(variant: "vibe" | "pro", email: string, password: string): Promise<Answer> {
  const res = await fetch(`/api/lab4/${variant}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return { status: res.status, body: await res.json() };
}

function AnswerBox({ title, who, answer, variant }: { title: string; who: string; answer: Answer; variant: "vibe" | "pro" }) {
  const ok = answer && (answer.body as { ok?: boolean }).ok;
  return (
    <section className={`panel ${variant}`}>
      <h2>{title}</h2>
      <p className="who">{who}</p>
      {answer ? (
        <>
          <div className={ok ? "success" : "error"}>
            {ok ? "Connexion acceptée" : "Connexion refusée"} — HTTP {answer.status}
          </div>
          <pre className="code">{JSON.stringify(answer.body, null, 2)}</pre>
        </>
      ) : (
        <p className="note">Choisis un scénario puis lance la connexion.</p>
      )}
    </section>
  );
}

export default function Lab4() {
  const [email, setEmail] = useState(PRESETS[0].email);
  const [password, setPassword] = useState(PRESETS[0].password);
  const [vibe, setVibe] = useState<Answer>(null);
  const [pro, setPro] = useState<Answer>(null);

  const submit = async () => {
    const [v, p] = await Promise.all([login("vibe", email, password), login("pro", email, password)]);
    setVibe(v);
    setPro(p);
  };

  return (
    <>
      <h1>Lab 4 — Un formulaire de connexion généré</h1>
      <p className="lede">
        Les mêmes identifiants sont envoyés aux deux routes. Essaie l&apos;injection SQL : elle ouvre le compte admin
        sans connaître son mot de passe.
      </p>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="row" style={{ marginBottom: 12, flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button key={p.label} className="ghost" onClick={() => { setEmail(p.email); setPassword(p.password); }}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="row">
          <input aria-label="Email" className="mono" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input aria-label="Mot de passe" className="mono" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={submit}>Se connecter</button>
        </div>
      </div>

      <div className="split">
        <AnswerBox title="Vibe codeur" who="SQL concaténé, mot de passe en clair, clé dans le code" answer={vibe} variant="vibe" />
        <AnswerBox title="Développeur augmenté" who="Validation zod, ORM paramétré, bcrypt, secret dans .env" answer={pro} variant="pro" />
      </div>
      <p className="note">Code volontairement vulnérable, à usage pédagogique et en local uniquement.</p>
    </>
  );
}
