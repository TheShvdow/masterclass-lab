// LAB 4 — version "dev augmenté".
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// ✅ Validation stricte des entrées
const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Email ou mot de passe invalide" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  // ✅ Requête paramétrée par l'ORM : aucune injection possible
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, passwordHash: true },
  });

  // ✅ Mot de passe vérifié contre un hash bcrypt, message d'erreur générique
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !valid) {
    return Response.json({ ok: false, error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  // ✅ Le secret vient de l'environnement, et on ne renvoie que le strict nécessaire
  const keyConfigured = Boolean(process.env.INTERNAL_API_KEY);
  const { passwordHash, ...safeUser } = user;
  return Response.json({ ok: true, user: safeUser, keyConfigured });
}
