// LAB 3 — version "dev augmenté" : une jointure + pagination.
import { db, measure } from "@/lib/db";

export async function GET(req: Request) {
  const page = Math.max(1, Number(new URL(req.url).searchParams.get("page")) || 1);
  const { result, queries, ms } = await measure(() =>
    db.user.findMany({
      select: { id: true, name: true, posts: { select: { id: true, title: true } } },
      orderBy: { id: "asc" },
      skip: (page - 1) * 20,
      take: 20,
    })
  );
  return Response.json({ rows: result.length, queries, ms, sample: result.slice(0, 3) });
}
