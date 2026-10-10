// LAB 4 — version "vibe codeur" : VOLONTAIREMENT VULNÉRABLE. Ne jamais copier ce code en production.
// Prompt utilisé : "Fais-moi une route de login avec SQLite"
import { db } from "@/lib/db";

// ❌ Faille 1 : une clé secrète écrite en dur dans le code (elle finit sur GitHub).
const API_KEY = "sk_live_51GTECH_demo_cle_exposee_dans_le_code";

export async function POST(req: Request) {
  const { email, password } = await req.json(); // ❌ Faille 2 : aucune validation des entrées

  // ❌ Faille 3 : requête SQL construite par concaténation → injection SQL
  // ❌ Faille 4 : mot de passe comparé en clair
  const sql = `SELECT id, name, email, role, passwordPlain FROM "User" WHERE email = '${email}' AND passwordPlain = '${password}' LIMIT 1`;
  const rows = (await db.$queryRawUnsafe(sql)) as unknown[];

  if (rows.length === 0) {
    return Response.json({ ok: false, error: `Aucun utilisateur trouvé pour ${email}` }, { status: 401 });
  }
  // ❌ Faille 5 : on renvoie tout, y compris le mot de passe… et la clé.
  return Response.json({ ok: true, user: rows[0], apiKey: API_KEY, executedSql: sql });
}
