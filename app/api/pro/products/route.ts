// LAB 1 — version "dev augmenté"
// Prompt cadré : filtre côté serveur, validation, pagination 20/page, colonnes utiles seulement.
import { z } from "zod";
import { db, measure } from "@/lib/db";

const Query = z.object({
  q: z.string().trim().max(60).default(""),
  category: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
});
const PAGE_SIZE = 20;

export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = Query.safeParse(params);
  if (!parsed.success) return Response.json({ error: "Paramètres invalides" }, { status: 400 });

  const { q, category, page } = parsed.data;
  const where = {
    ...(q ? { name: { contains: q } } : {}),
    ...(category ? { categoryId: category } : {}),
  };

  const { result, queries, ms } = await measure(() =>
    Promise.all([
      db.product.findMany({
        where,
        select: { id: true, name: true, price: true, category: { select: { name: true } } },
        orderBy: { id: "asc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      db.product.count({ where }),
    ])
  );
  const [items, total] = result;
  return Response.json({ items, total, page, pages: Math.ceil(total / PAGE_SIZE), queries, ms });
}
