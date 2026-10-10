// LAB 1 — version "vibe codeur"
// Prompt utilisé : "Ajoute un filtre à ma liste de produits"
// Résultat typique : l'IA renvoie TOUT au navigateur et filtre côté client.
import { db } from "@/lib/db";

export async function GET() {
  const products = await db.product.findMany({ include: { category: true } });
  return Response.json(products);
}
