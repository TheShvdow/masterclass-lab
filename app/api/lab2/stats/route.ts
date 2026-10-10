// LAB 2 — une API qui plante et renvoie une page HTML au lieu de JSON.
// C'est exactement ce qui provoque "Unexpected token '<' ... is not valid JSON" côté front.
export async function GET(req: Request) {
  const broken = new URL(req.url).searchParams.get("broken") === "1";
  if (broken) {
    return new Response(
      "<!DOCTYPE html><html><body><h1>500 — Internal Server Error</h1><p>Database connection lost</p></body></html>",
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
  return Response.json({ visitors: 1284, orders: 87, revenue: 2_450_000 });
}
