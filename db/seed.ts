import { getDb } from "../api/queries/connection";
import { categories, products, users } from "@db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await db.insert(users).values({
    name: "Admin User",
    email: "admin@rutesu.shop",
    password: hashedPassword,
    emailVerified: true,
    role: "admin",
  });
  console.log("Admin user created: admin@rutesu.shop / admin123");

  // Create demo user
  const demoPassword = await bcrypt.hash("demo123", 12);
  await db.insert(users).values({
    name: "Demo User",
    email: "demo@rutesu.shop",
    password: demoPassword,
    emailVerified: true,
    role: "user",
  });
  console.log("Demo user created: demo@rutesu.shop / demo123");

  // Categories
  const categoryData = [
    { name: "Elektronik", slug: "elektronik", description: "Akıllı telefonlar, laptoplar, kulaklıklar ve daha fazlası", image: "/images/elektronik.jpg" },
    { name: "Giyim", slug: "giyim", description: "Erkek, kadın ve çocuk giyim ürünleri", image: "/images/giyim.jpg" },
    { name: "Ev & Yaşam", slug: "ev-yasam", description: "Ev dekorasyonu, mobilya ve yaşam ürünleri", image: "/images/ev-yasam.jpg" },
    { name: "Spor", slug: "spor", description: "Spor ekipmanları, giyim ve aksesuarları", image: "/images/spor.jpg" },
    { name: "Kitap", slug: "kitap", description: "Roman, bilim, tarih ve daha fazlası", image: "/images/kitap.jpg" },
    { name: "Kozmetik", slug: "kozmetik", description: "Cilt bakımı, makyaj ve kişisel bakım ürünleri", image: "/images/kozmetik.jpg" },
  ];

  await db.insert(categories).values(categoryData);
  console.log("6 categories created");

  // Products - 6 per category = 36 total
  const productData = [
    // Elektronik (categoryId: 1)
    { name: "iPhone 15 Pro", slug: "iphone-15-pro", description: "En yeni iPhone modeli, A17 Pro çip, titanyum tasarım, 48MP kamera sistemi.", price: "74999.00", salePrice: "69999.00", image: "/images/iphone-15-pro.jpg", images: JSON.stringify(["/images/iphone-15-pro.jpg"]), categoryId: 1, stock: 15, featured: true, isNew: true },
    { name: "MacBook Air M3", slug: "macbook-air-m3", description: "Ultra ince ve hafif, M3 çip ile muhteşem performans, 18 saat pil ömrü.", price: "54999.00", salePrice: null, image: "/images/macbook-air-m3.jpg", images: JSON.stringify(["/images/macbook-air-m3.jpg"]), categoryId: 1, stock: 10, featured: true, isNew: true },
    { name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5", description: "Endüstri lideri gürültü engelleme, 30 saat pil ömrü, premium ses kalitesi.", price: "12999.00", salePrice: "10999.00", image: "/images/sony-wh-1000xm5.jpg", images: JSON.stringify(["/images/sony-wh-1000xm5.jpg"]), categoryId: 1, stock: 25, featured: true, isNew: false },
    { name: "Samsung Galaxy Watch 6", slug: "samsung-galaxy-watch-6", description: "Gelişmiş sağlık takibi, AMOLED ekran, 40mm kasa boyutu.", price: "6999.00", salePrice: null, image: "/images/samsung-galaxy-watch-6.jpg", images: JSON.stringify(["/images/samsung-galaxy-watch-6.jpg"]), categoryId: 1, stock: 20, featured: false, isNew: true },
    { name: "iPad Air 5", slug: "ipad-air-5", description: "M1 çip, 10.9 inç Liquid Retina ekran, çok yönlü kullanım.", price: "21999.00", salePrice: "19999.00", image: "/images/ipad-air-5.jpg", images: JSON.stringify(["/images/ipad-air-5.jpg"]), categoryId: 1, stock: 12, featured: false, isNew: false },
    { name: "AirPods Pro 2", slug: "airpods-pro-2", description: "Aktif gürültü engelleme, Uzamsal Ses, MagSafe şarj kutusu.", price: "8499.00", salePrice: null, image: "/images/airpods-pro-2.jpg", images: JSON.stringify(["/images/airpods-pro-2.jpg"]), categoryId: 1, stock: 30, featured: true, isNew: false },

    // Giyim (categoryId: 2)
    { name: "Premium Keten Gömlek", slug: "premium-keten-gomlek", description: "100% doğal keten, nefes alabilir kumaş, rahat kesim.", price: "1299.00", salePrice: "999.00", image: "/images/premium-keten-gomlek.jpg", images: JSON.stringify(["/images/premium-keten-gomlek.jpg"]), categoryId: 2, stock: 40, featured: true, isNew: false },
    { name: "Slim Fit Chino Pantolon", slug: "slim-fit-chino-pantolon", description: "Yüksek kalite pamuk kumaş, modern slim fit kesim, 4 farklı renk.", price: "899.00", salePrice: null, image: "/images/slim-fit-chino-pantolon.jpg", images: JSON.stringify(["/images/slim-fit-chino-pantolon.jpg"]), categoryId: 2, stock: 50, featured: false, isNew: true },
    { name: "Oversize Hoodie", slug: "oversize-hoodie", description: "%80 pamuk %20 polyester, oversize kesim, kanguru cepli.", price: "749.00", salePrice: "599.00", image: "/images/oversize-hoodie.jpg", images: JSON.stringify(["/images/oversize-hoodie.jpg"]), categoryId: 2, stock: 35, featured: true, isNew: true },
    { name: "Merino Yün Kazak", slug: "merino-yun-kazak", description: "İtalyan merino yünü, yumuşak dokulu, kış koleksiyonu.", price: "1599.00", salePrice: null, image: "/images/merino-yun-kazak.jpg", images: JSON.stringify(["/images/merino-yun-kazak.jpg"]), categoryId: 2, stock: 20, featured: false, isNew: true },
    { name: "Deri Ceket", slug: "deri-ceket", description: "Gerçek deri, klasik motosiklet stili, zamansız tasarım.", price: "4999.00", salePrice: "3999.00", image: "/images/deri-ceket.jpg", images: JSON.stringify(["/images/deri-ceket.jpg"]), categoryId: 2, stock: 8, featured: true, isNew: false },
    { name: "Spor Tişört", slug: "spor-tisort", description: "Nefes alabilir teknolojik kumaş, ter tutmayan yapı.", price: "349.00", salePrice: null, image: "/images/spor-tisort.jpg", images: JSON.stringify(["/images/spor-tisort.jpg"]), categoryId: 2, stock: 60, featured: false, isNew: false },

    // Ev & Yaşam (categoryId: 3)
    { name: "Seramik Vazo Seti", slug: "seramik-vazo-seti", description: "El yapımı seramik, 3 parça set, modern minimalist tasarım.", price: "599.00", salePrice: "449.00", image: "/images/seramik-vazo-seti.jpg", images: JSON.stringify(["/images/seramik-vazo-seti.jpg"]), categoryId: 3, stock: 25, featured: true, isNew: false },
    { name: "Akıllı LED Lamba", slug: "akilli-led-lamba", description: "RGB renk seçenekleri, uygulama kontrolü, sesli komut desteği.", price: "899.00", salePrice: null, image: "/images/akilli-led-lamba.jpg", images: JSON.stringify(["/images/akilli-led-lamba.jpg"]), categoryId: 3, stock: 30, featured: false, isNew: true },
    { name: "Organik Pamuk Nevresim", slug: "organik-pamuk-nevresim", description: "%100 organik pamuk, 200TC, çift kişilik, 4 parça set.", price: "1299.00", salePrice: "999.00", image: "/images/organik-pamuk-nevresim.jpg", images: JSON.stringify(["/images/organik-pamuk-nevresim.jpg"]), categoryId: 3, stock: 18, featured: true, isNew: false },
    { name: "Bambu Kesme Tahtası", slug: "bambu-kesme-tahtasi", description: "Doğal bambu, antibakteriyel, büyük boy, mutfak gereci.", price: "249.00", salePrice: null, image: "/images/bambu-kesme-tahtasi.jpg", images: JSON.stringify(["/images/bambu-kesme-tahtasi.jpg"]), categoryId: 3, stock: 45, featured: false, isNew: false },
    { name: "Dekoratif Ayna", slug: "dekoratif-ayna", description: "Yuvarlak duvar aynası, metal çerçeve, 60cm çap.", price: "799.00", salePrice: null, image: "/images/dekoratif-ayna.jpg", images: JSON.stringify(["/images/dekoratif-ayna.jpg"]), categoryId: 3, stock: 15, featured: true, isNew: true },
    { name: "Kokulu Mum Seti", slug: "kokulu-mum-seti", description: "3 farklı koku, doğal balmumu, 40 saat yanma süresi.", price: "349.00", salePrice: "279.00", image: "/images/kokulu-mum-seti.jpg", images: JSON.stringify(["/images/kokulu-mum-seti.jpg"]), categoryId: 3, stock: 40, featured: false, isNew: false },

    // Spor (categoryId: 4)
    { name: "Yoga Matı", slug: "yoga-mati", description: "6mm kalınlık, kaymaz yüzey, çevre dostu TPE malzeme.", price: "449.00", salePrice: null, image: "/images/yoga-mati.jpg", images: JSON.stringify(["/images/yoga-mati.jpg"]), categoryId: 4, stock: 35, featured: true, isNew: false },
    { name: "Dambıl Seti 20kg", slug: "dambil-seti-20kg", description: "Ayarlanabilir dambıl seti, krom kaplama, taşıma çantası.", price: "1599.00", salePrice: "1299.00", image: "/images/dambil-seti-20kg.jpg", images: JSON.stringify(["/images/dambil-seti-20kg.jpg"]), categoryId: 4, stock: 12, featured: true, isNew: false },
    { name: "Koşu Ayakkabısı", slug: "kosu-ayakkabisi", description: "Hafif ve nefes alabilir, amortisörlü taban, 3 renk seçeneği.", price: "2499.00", salePrice: null, image: "/images/kosu-ayakkabisi.jpg", images: JSON.stringify(["/images/kosu-ayakkabisi.jpg"]), categoryId: 4, stock: 22, featured: true, isNew: true },
    { name: "Spor Çantası 40L", slug: "spor-cantasi-40l", description: "Su geçirmez, ayakkabı bölmesi, omuz askıları.", price: "699.00", salePrice: "549.00", image: "/images/spor-cantasi-40l.jpg", images: JSON.stringify(["/images/spor-cantasi-40l.jpg"]), categoryId: 4, stock: 28, featured: false, isNew: false },
    { name: "Direnç Lastiği Seti", slug: "direnc-lastigi-seti", description: "5 farklı direnç seviyesi, kapı ankrajı, taşıma çantası.", price: "299.00", salePrice: null, image: "/images/direnc-lastigi-seti.jpg", images: JSON.stringify(["/images/direnc-lastigi-seti.jpg"]), categoryId: 4, stock: 50, featured: false, isNew: true },
    { name: "Termos 750ml", slug: "termos-750ml", description: "Çift duvarlı vakum, 24 saat sıcak/soğuk tutma.", price: "349.00", salePrice: null, image: "/images/termos-750ml.jpg", images: JSON.stringify(["/images/termos-750ml.jpg"]), categoryId: 4, stock: 40, featured: false, isNew: false },

    // Kitap (categoryId: 5)
    { name: "Sapiens", slug: "sapiens", description: "Yuval Noah Harari - İnsan türünün kısa bir tarihi.", price: "249.00", salePrice: "189.00", image: "/images/sapiens.jpg", images: JSON.stringify(["/images/sapiens.jpg"]), categoryId: 5, stock: 30, featured: true, isNew: false },
    { name: "Atomik Alışkanlıklar", slug: "atomik-aliskanliklar", description: "James Clear - Küçük değişikliklerle büyük sonuçlar elde etme.", price: "219.00", salePrice: null, image: "/images/atomik-aliskanliklar.jpg", images: JSON.stringify(["/images/atomik-aliskanliklar.jpg"]), categoryId: 5, stock: 25, featured: true, isNew: false },
    { name: "1984", slug: "1984", description: "George Orwell - Klasik distopya, özel baskı.", price: "89.00", salePrice: null, image: "/images/1984.jpg", images: JSON.stringify(["/images/1984.jpg"]), categoryId: 5, stock: 50, featured: false, isNew: false },
    { name: "Dune", slug: "dune", description: "Frank Herbert - Bilim kurgunun başyapıtı.", price: "179.00", salePrice: "149.00", image: "/images/dune.jpg", images: JSON.stringify(["/images/dune.jpg"]), categoryId: 5, stock: 20, featured: true, isNew: true },
    { name: "Psikoloji Kitabı", slug: "psikoloji-kitabi", description: "Oliver Sacks - Vaka incelemeleri ve beyin hikayeleri.", price: "199.00", salePrice: null, image: "/images/psikoloji-kitabi.jpg", images: JSON.stringify(["/images/psikoloji-kitabi.jpg"]), categoryId: 5, stock: 18, featured: false, isNew: true },
    { name: "Felsefe Giriş", slug: "felsefe-giris", description: "Sophie'nin Dünyası - Felsefeye çarpıcı bir giriş.", price: "159.00", salePrice: null, image: "/images/felsefe-giris.jpg", images: JSON.stringify(["/images/felsefe-giris.jpg"]), categoryId: 5, stock: 22, featured: false, isNew: false },

    // Kozmetik (categoryId: 6)
    { name: "Hyaluronik Asit Serum", slug: "hyaluronik-asit-serum", description: "Yoğun nemlendirme, cilt bariyerini güçlendirme, 30ml.", price: "499.00", salePrice: "399.00", image: "/images/hyaluronik-asit-serum.jpg", images: JSON.stringify(["/images/hyaluronik-asit-serum.jpg"]), categoryId: 6, stock: 35, featured: true, isNew: true },
    { name: "Organik Şampuan", slug: "organik-sampuan", description: "Sülfatsız, doğal içerikler, tüm saç tipleri için.", price: "349.00", salePrice: null, image: "/images/organik-sampuan.jpg", images: JSON.stringify(["/images/organik-sampuan.jpg"]), categoryId: 6, stock: 40, featured: false, isNew: false },
    { name: "Vitamin C Krem", slug: "vitamin-c-krem", description: "Aydınlatıcı etki, antioksidan koruma, SPF 30.", price: "599.00", salePrice: "499.00", image: "/images/vitamin-c-krem.jpg", images: JSON.stringify(["/images/vitamin-c-krem.jpg"]), categoryId: 6, stock: 25, featured: true, isNew: false },
    { name: "Makyaj Seti", slug: "makyaj-seti", description: "12 parça profesyonel makyaj fırça seti, deri çanta.", price: "799.00", salePrice: null, image: "/images/makyaj-seti.jpg", images: JSON.stringify(["/images/makyaj-seti.jpg"]), categoryId: 6, stock: 20, featured: true, isNew: true },
    { name: "Parfüm 50ml", slug: "parfum-50ml", description: "Uzakdoğu esintileri, odunsu ve baharatlı notalar.", price: "1299.00", salePrice: "999.00", image: "/images/parfum-50ml.jpg", images: JSON.stringify(["/images/parfum-50ml.jpg"]), categoryId: 6, stock: 15, featured: true, isNew: false },
    { name: "Dudak Bakım Seti", slug: "dudak-bakim-seti", description: "3 farklı renk, doğal içerikli, nemlendirici.", price: "199.00", salePrice: null, image: "/images/dudak-bakim-seti.jpg", images: JSON.stringify(["/images/dudak-bakim-seti.jpg"]), categoryId: 6, stock: 45, featured: false, isNew: true },
  ];

  await db.insert(products).values(productData);
  console.log("36 products created");

  console.log("Seed completed successfully!");
}

seed().catch(console.error);
