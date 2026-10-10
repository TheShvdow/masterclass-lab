import Link from "next/link";

const LABS = [
  { href: "/lab1", title: "1. Même feature, deux approches", text: "Un filtre sur 10 000 produits : tout charger dans le navigateur, ou filtrer et paginer côté serveur." },
  { href: "/lab2", title: "2. Déboguer avec ou sans comprendre", text: "Deux erreurs classiques du code généré : .map() sur undefined et « Unexpected token '<' »." },
  { href: "/lab3", title: "3. Performance : le piège N+1", text: "300 utilisateurs et leurs articles : 301 requêtes SQL, ou une seule." },
  { href: "/lab4", title: "4. Sécurité : un login généré", text: "Injection SQL, mots de passe en clair, clé dans le code : la même route, réécrite proprement." },
];

export default function Home() {
  return (
    <>
      <h1>Vibe codeur vs développeur augmenté</h1>
      <p className="lede">
        Quatre démonstrations en direct. À gauche, le code qu&apos;on obtient avec un prompt vague. À droite, le même
        besoin traité par quelqu&apos;un qui comprend ce qu&apos;il demande à l&apos;IA.
      </p>
      <div className="labs">
        {LABS.map((l) => (
          <Link key={l.href} href={l.href} className="lab-link">
            <h2>{l.title}</h2>
            <p>{l.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
