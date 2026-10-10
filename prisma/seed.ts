import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = ["Téléphones", "Ordinateurs", "Audio", "Maison", "Mode", "Beauté", "Sport", "Alimentation"];
const ADJ = ["Pro", "Max", "Lite", "Plus", "Mini", "Ultra", "Classic", "Smart", "Eco", "Prime"];
const NOUNS: Record<string, string[]> = {
  "Téléphones": ["Smartphone", "Coque", "Chargeur", "Câble USB-C", "Batterie externe"],
  "Ordinateurs": ["Laptop", "Clavier", "Souris", "Écran", "Disque SSD"],
  "Audio": ["Casque", "Écouteurs", "Enceinte", "Micro", "Barre de son"],
  "Maison": ["Ventilateur", "Lampe", "Bouilloire", "Mixeur", "Climatiseur"],
  "Mode": ["Boubou", "Sneakers", "Sac", "Montre", "Lunettes"],
  "Beauté": ["Parfum", "Crème", "Savon", "Huile de karité", "Brosse"],
  "Sport": ["Ballon", "Maillot", "Tapis de yoga", "Haltères", "Gourde"],
  "Alimentation": ["Café Touba", "Bissap", "Thiakry", "Riz parfumé", "Huile d'arachide"],
};

const FIRST = ["Awa", "Moussa", "Fatou", "Ibrahima", "Aminata", "Cheikh", "Mariama", "Ousmane", "Khady", "Abdou", "Ndeye", "Mamadou"];
const LAST = ["Diop", "Ndiaye", "Fall", "Sow", "Ba", "Sarr", "Gueye", "Faye", "Diallo", "Cissé", "Mbaye", "Kane"];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

async function main() {
  console.log("→ Catégories");
  for (const name of CATEGORIES) await prisma.category.create({ data: { name } });
  const cats = await prisma.category.findMany();

  console.log("→ 10 000 produits");
  const products = Array.from({ length: 10_000 }, (_, i) => {
    const cat = cats[i % cats.length];
    const noun = pick(NOUNS[cat.name], Math.floor(i / cats.length));
    return {
      name: `${noun} ${pick(ADJ, i * 7)} ${1000 + i}`,
      price: 1500 + ((i * 7919) % 500_000),
      stock: (i * 31) % 120,
      categoryId: cat.id,
    };
  });
  for (let i = 0; i < products.length; i += 1000) {
    await prisma.product.createMany({ data: products.slice(i, i + 1000) });
  }

  console.log("→ 300 utilisateurs + 1 500 posts");
  // Le premier utilisateur est l'admin : c'est lui qu'on "vole" avec l'injection SQL du lab 4.
  const adminHash = await bcrypt.hash("Admin@2026", 8);
  await prisma.user.create({
    data: { name: "Admin GTECH", email: "admin@gtech.sn", role: "admin", passwordPlain: "Admin@2026", passwordHash: adminHash },
  });
  const demoHash = await bcrypt.hash("demo1234", 8);
  for (let i = 1; i < 300; i++) {
    const first = pick(FIRST, i);
    const last = pick(LAST, i * 5);
    await prisma.user.create({
      data: {
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@exemple.sn`,
        passwordPlain: "demo1234",
        passwordHash: demoHash,
        posts: { create: Array.from({ length: 5 }, (_, k) => ({ title: `Article ${k + 1} de ${first}` })) },
      },
    });
  }
  console.log("✓ Base prête");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
