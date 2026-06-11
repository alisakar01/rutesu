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
    { name: "Elektronik", slug: "elektronik", description: "Akıllı telefonlar, laptoplar, kulaklıklar ve daha fazlası", image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&q=80" },
    { name: "Giyim", slug: "giyim", description: "Erkek, kadın ve çocuk giyim ürünleri", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80" },
    { name: "Ev & Yaşam", slug: "ev-yasam", description: "Ev dekorasyonu, mobilya ve yaşam ürünleri", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" },
    { name: "Spor", slug: "spor", description: "Spor ekipmanları, giyim ve aksesuarları", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80" },
    { name: "Kitap", slug: "kitap", description: "Roman, bilim, tarih ve daha fazlası", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80" },
    { name: "Kozmetik", slug: "kozmetik", description: "Cilt bakımı, makyaj ve kişisel bakım ürünleri", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80" },
  ];

  await db.insert(categories).values(categoryData);
  console.log("6 categories created");

  // Products - 6 per category = 36 total
  const productData = [
    // Elektronik (categoryId: 1)
    { name: "iPhone 15 Pro", slug: "iphone-15-pro", description: "En yeni iPhone modeli, A17 Pro çip, titanyum tasarım, 48MP kamera sistemi.", price: "74999.00", salePrice: "69999.00", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600&q=80", categoryId: 1, stock: 15, featured: true, isNew: true },
    { name: "MacBook Air M3", slug: "macbook-air-m3", description: "Ultra ince ve hafif, M3 çip ile muhteşem performans, 18 saat pil ömrü.", price: "54999.00", salePrice: null, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80", categoryId: 1, stock: 10, featured: true, isNew: true },
    { name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5", description: "Endüstri lideri gürültü engelleme, 30 saat pil ömrü, premium ses kalitesi.", price: "12999.00", salePrice: "10999.00", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80", categoryId: 1, stock: 25, featured: true, isNew: false },
    { name: "Samsung Galaxy Watch 6", slug: "samsung-galaxy-watch-6", description: "Gelişmiş sağlık takibi, AMOLED ekran, 40mm kasa boyutu.", price: "6999.00", salePrice: null, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80", categoryId: 1, stock: 20, featured: false, isNew: true },
    { name: "iPad Air 5", slug: "ipad-air-5", description: "M1 çip, 10.9 inç Liquid Retina ekran, çok yönlü kullanım.", price: "21999.00", salePrice: "19999.00", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80", categoryId: 1, stock: 12, featured: false, isNew: false },
    { name: "AirPods Pro 2", slug: "airpods-pro-2", description: "Aktif gürültü engelleme, Uzamsal Ses, MagSafe şarj kutusu.", price: "8499.00", salePrice: null, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80", categoryId: 1, stock: 30, featured: true, isNew: false },

    // Giyim (categoryId: 2)
    { name: "Premium Keten Gömlek", slug: "premium-keten-gomlek", description: "100% doğal keten, nefes alabilir kumaş, rahat kesim.", price: "1299.00", salePrice: "999.00", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", categoryId: 2, stock: 40, featured: true, isNew: false },
    { name: "Slim Fit Chino Pantolon", slug: "slim-fit-chino-pantolon", description: "Yüksek kalite pamuk kumaş, modern slim fit kesim, 4 farklı renk.", price: "899.00", salePrice: null, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", categoryId: 2, stock: 50, featured: false, isNew: true },
    { name: " Oversize Hoodie", slug: "oversize-hoodie", description: "%80 pamuk %20 polyester, oversize kesim, kanguru cepli.", price: "749.00", salePrice: "599.00", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80", categoryId: 2, stock: 35, featured: true, isNew: true },
    { name: "Merino Yün Kazak", slug: "merino-yun-kazak", description: "İtalyan merino yünü, yumuşak dokulu, kış koleksiyonu.", price: "1599.00", salePrice: null, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", categoryId: 2, stock: 20, featured: false, isNew: true },
    { name: "Deri Ceket", slug: "deri-ceket", description: "Gerçek deri, klasik motosiklet stili, zamansız tasarım.", price: "4999.00", salePrice: "3999.00", image: "https://images.unsplash.com/photo-1551028919-ac76c9028d1b?w=600&q=80", categoryId: 2, stock: 8, featured: true, isNew: false },
    { name: "Spor Tişört", slug: "spor-tisort", description: "Nefes alabilir teknolojik kumaş, ter tutmayan yapı.", price: "349.00", salePrice: null, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", categoryId: 2, stock: 60, featured: false, isNew: false },

    // Ev & Yaşam (categoryId: 3)
    { name: "Seramik Vazo Seti", slug: "seramik-vazo-seti", description: "El yapımı seramik, 3 parça set, modern minimalist tasarım.", price: "599.00", salePrice: "449.00", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80", categoryId: 3, stock: 25, featured: true, isNew: false },
    { name: "Akıllı LED Lamba", slug: "akilli-led-lamba", description: "RGB renk seçenekleri, uygulama kontrolü, sesli komut desteği.", price: "899.00", salePrice: null, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80", categoryId: 3, stock: 30, featured: false, isNew: true },
    { name: "Organik Pamuk Nevresim", slug: "organik-pamuk-nevresim", description: "%100 organik pamuk, 200TC, çift kişilik, 4 parça set.", price: "1299.00", salePrice: "999.00", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80", categoryId: 3, stock: 18, featured: true, isNew: false },
    { name: "Bambu Kesme Tahtası", slug: "bambu-kesme-tahtasi", description: "Doğal bambu, antibakteriyel, büyük boy, mutfak gereci.", price: "249.00", salePrice: null, image: "https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=600&q=80", categoryId: 3, stock: 45, featured: false, isNew: false },
    { name: "Dekoratif Ayna", slug: "dekoratif-ayna", description: "Yuvarlak duvar aynası, metal çerçeve, 60cm çap.", price: "799.00", salePrice: null, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80", categoryId: 3, stock: 15, featured: true, isNew: true },
    { name: "Kokulu Mum Seti", slug: "kokulu-mum-seti", description: "3 farklı koku, doğal balmumu, 40 saat yanma süresi.", price: "349.00", salePrice: "279.00", image: "https://images.unsplash.com/photo-1602607203195-a371dc02504f?w=600&q=80", categoryId: 3, stock: 40, featured: false, isNew: false },

    // Spor (categoryId: 4)
    { name: "Yoga Matı", slug: "yoga-mati", description: "6mm kalınlık, kaymaz yüzey, çevre dostu TPE malzeme.", price: "449.00", salePrice: null, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80", categoryId: 4, stock: 35, featured: true, isNew: false },
    { name: "Dambıl Seti 20kg", slug: "dambil-seti-20kg", description: "Ayarlanabilir dambıl seti, krom kaplama, taşıma çantası.", price: "1599.00", salePrice: "1299.00", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80", categoryId: 4, stock: 12, featured: true, isNew: false },
    { name: "Koşu Ayakkabısı", slug: "kosu-ayakkabisi", description: "Hafif ve nefes alabilir, amortisörlü taban, 3 renk seçeneği.", price: "2499.00", salePrice: null, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", categoryId: 4, stock: 22, featured: true, isNew: true },
    { name: "Spor Çantası 40L", slug: "spor-cantasi-40l", description: "Su geçirmez, ayakkabı bölmesi, omuz askıları.", price: "699.00", salePrice: "549.00", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", categoryId: 4, stock: 28, featured: false, isNew: false },
    { name: "Direnç Lastiği Seti", slug: "direnc-lastigi-seti", description: "5 farklı direnç seviyesi, kapı ankrajı, taşıma çantası.", price: "299.00", salePrice: null, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80", categoryId: 4, stock: 50, featured: false, isNew: true },
    { name: "Termos 750ml", slug: "termos-750ml", description: "Çift duvarlı vakum, 24 saat sıcak/soğuk tutma.", price: "349.00", salePrice: null, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80", categoryId: 4, stock: 40, featured: false, isNew: false },

    // Kitap (categoryId: 5)
    { name: "Sapiens", slug: "sapiens", description: "Yuval Noah Harari - İnsan türünün kısa bir tarihi.", price: "249.00", salePrice: "189.00", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80", categoryId: 5, stock: 30, featured: true, isNew: false },
    { name: "Atomik Alışkanlıklar", slug: "atomik-aliskanliklar", description: "James Clear - Küçük değişikliklerle büyük sonuçlar elde etme.", price: "219.00", salePrice: null, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80", categoryId: 5, stock: 25, featured: true, isNew: false },
    { name: "1984", slug: "1984", description: "George Orwell - Klasik distopya, özel baskı.", price: "89.00", salePrice: null, image: "https://images.unsplash.com/photo-1531988042232-e9689c3cd6f5?w=600&q=80", categoryId: 5, stock: 50, featured: false, isNew: false },
    { name: "Dune", slug: "dune", description: "Frank Herbert - Bilim kurgunun başyapıtı.", price: "179.00", salePrice: "149.00", image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&q=80", categoryId: 5, stock: 20, featured: true, isNew: true },
    { name: "Psikoloji Kitabı", slug: "psikoloji-kitabi", description: "Oliver Sacks - Vaka incelemeleri ve beyin hikayeleri.", price: "199.00", salePrice: null, image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80", categoryId: 5, stock: 18, featured: false, isNew: true },
    { name: "Felsefe Giriş", slug: "felsefe-giris", description: "Sophie'nin Dünyası - Felsefeye çarpıcı bir giriş.", price: "159.00", salePrice: null, image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80", categoryId: 5, stock: 22, featured: false, isNew: false },

    // Kozmetik (categoryId: 6)
    { name: "Hyaluronik Asit Serum", slug: "hyaluronik-asit-serum", description: "Yoğun nemlendirme, cilt bariyerini güçlendirme, 30ml.", price: "499.00", salePrice: "399.00", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", categoryId: 6, stock: 35, featured: true, isNew: true },
    { name: "Organik Şampuan", slug: "organik-sampuan", description: "Sülfatsız, doğal içerikler, tüm saç tipleri için.", price: "349.00", salePrice: null, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80", categoryId: 6, stock: 40, featured: false, isNew: false },
    { name: "Vitamin C Krem", slug: "vitamin-c-krem", description: "Aydınlatıcı etki, antioksidan koruma, SPF 30.", price: "599.00", salePrice: "499.00", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", categoryId: 6, stock: 25, featured: true, isNew: false },
    { name: "Makyaj Seti", slug: "makyaj-seti", description: "12 parça profesyonel makyaj fırça seti, deri çanta.", price: "799.00", salePrice: null, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80", categoryId: 6, stock: 20, featured: true, isNew: true },
    { name: "Parfüm 50ml", slug: "parfum-50ml", description: "Uzakdoğu esintileri, odunsu ve baharatlı notalar.", price: "1299.00", salePrice: "999.00", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80", categoryId: 6, stock: 15, featured: true, isNew: false },
    { name: "Dudak Bakım Seti", slug: "dudak-bakim-seti", description: "3 farklı renk, doğal içerikli, nemlendirici.", price: "199.00", salePrice: null, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=600&q=80", categoryId: 6, stock: 45, featured: false, isNew: true },
  ];

  await db.insert(products).values(productData);
  console.log("36 products created");

  console.log("Seed completed successfully!");
}

seed().catch(console.error);
