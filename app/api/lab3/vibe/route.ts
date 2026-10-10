// LAB 3 — version "vibe codeur" : le problème N+1.
// 1 requête pour les utilisateurs + 1 requête PAR utilisateur pour ses posts.
import { db, measure } from "@/lib/db";

export async function GET() {
  const { result, queries, ms } = await measure(async () => {
    const users = await db.user.findMany({ select: { id: true, name: true } });
    const withPosts = [];
    for (const u of users) {
      const posts = await db.post.findMany({ where: { authorId: u.id }, select: { id: true, title: true } });
      withPosts.push({ ...u, posts });
    }
    return withPosts;
  });
  return Response.json({ rows: result.length, queries, ms, sample: result.slice(0, 3) });
}
