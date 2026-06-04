import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb://127.0.0.1:27017/ecommerce";

const products = [
  {
    title: "iPhone 15 Pro",
    description: "Apple iPhone 15 Pro with A17 Pro chip, 48MP camera system, titanium design, and USB-C connectivity.",
    price: 999,
    stock: 25,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
  },
  {
    title: "Samsung Galaxy S24",
    description: "Samsung Galaxy S24 with Snapdragon 8 Gen 3, 50MP camera, 6.2-inch Dynamic AMOLED display.",
    price: 799,
    stock: 30,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with 30-hour battery life and crystal clear hands-free calling.",
    price: 349,
    stock: 40,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
  },
  {
    title: "MacBook Air M2",
    description: "Apple MacBook Air with M2 chip, 13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD.",
    price: 1099,
    stock: 15,
    category: "Computers",
    image: "https://images.unsplash.com/photo-1611186871525-9c4a3b3e5e5e?w=500&q=80",
  },
  {
    title: "Nike Air Max 270",
    description: "Men's Nike Air Max 270 running shoes with large Air unit for all-day comfort and bold style.",
    price: 150,
    stock: 60,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  },
  {
    title: "Adidas Ultraboost 23",
    description: "Adidas Ultraboost 23 with responsive BOOST midsole, Primeknit+ upper, and Continental rubber outsole.",
    price: 190,
    stock: 45,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80",
  },
  {
    title: "Levi's 501 Original Jeans",
    description: "The original straight fit jeans by Levi's. Made with 100% cotton denim, button fly, and iconic 5-pocket styling.",
    price: 69,
    stock: 80,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
  },
  {
    title: "Apple Watch Series 9",
    description: "Apple Watch Series 9 with S9 chip, Always-On Retina display, advanced health sensors, and crash detection.",
    price: 399,
    stock: 35,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
  },
  {
    title: "Canon EOS R50 Camera",
    description: "Canon EOS R50 mirrorless camera with 24.2MP APS-C sensor, 4K video, and dual pixel autofocus.",
    price: 679,
    stock: 20,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
  },
  {
    title: "IKEA MALM Desk",
    description: "IKEA MALM writing desk with clean lines and a smooth surface. Perfect for home office or study room.",
    price: 199,
    stock: 18,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80",
  },
  {
    title: "Dyson V15 Vacuum",
    description: "Dyson V15 Detect cordless vacuum with laser dust detection, HEPA filtration, and 60-minute battery life.",
    price: 749,
    stock: 12,
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  },
  {
    title: "The North Face Jacket",
    description: "The North Face men's waterproof jacket with DryVent technology, adjustable hood, and multiple pockets.",
    price: 220,
    stock: 50,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
  },
  {
    title: "Kindle Paperwhite",
    description: "Amazon Kindle Paperwhite with 6.8-inch display, adjustable warm light, waterproof design, and weeks of battery.",
    price: 139,
    stock: 55,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80",
  },
  {
    title: "Instant Pot Duo 7-in-1",
    description: "Instant Pot Duo 7-in-1 electric pressure cooker — pressure cooker, slow cooker, rice cooker, steamer, and more.",
    price: 89,
    stock: 70,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80",
  },
  {
    title: "Ray-Ban Aviator Sunglasses",
    description: "Classic Ray-Ban Aviator sunglasses with gold metal frame, green G-15 lenses, and UV400 protection.",
    price: 154,
    stock: 65,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
  },
  {
    title: "Yoga Mat Premium",
    description: "Non-slip premium yoga mat with alignment lines, 6mm thickness, eco-friendly TPE material, and carry strap.",
    price: 45,
    stock: 90,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=500&q=80",
  },
  {
    title: "Bosch Cordless Drill",
    description: "Bosch 18V cordless drill with 2-speed gearbox, 13mm keyless chuck, LED light, and 2Ah battery included.",
    price: 129,
    stock: 28,
    category: "Tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&q=80",
  },
  {
    title: "Perfume Dior Sauvage",
    description: "Dior Sauvage Eau de Parfum for men — fresh, woody fragrance with bergamot, ambroxan, and vanilla notes. 100ml.",
    price: 110,
    stock: 42,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80",
  },
  {
    title: "Gaming Chair Pro",
    description: "Ergonomic gaming chair with lumbar support, adjustable armrests, reclining backrest, and premium PU leather.",
    price: 299,
    stock: 22,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80",
  },
  {
    title: "Wireless Mechanical Keyboard",
    description: "Compact 75% wireless mechanical keyboard with RGB backlight, hot-swappable switches, and 3-device Bluetooth.",
    price: 119,
    stock: 38,
    category: "Computers",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("products");

    // Add timestamps
    const now = new Date();
    const productsWithTimestamps = products.map((p) => ({
      ...p,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await collection.insertMany(productsWithTimestamps);
    console.log(`✅ Successfully inserted ${result.insertedCount} products!`);
  } catch (err) {
    console.error("Error seeding products:", err);
  } finally {
    await client.close();
  }
}

seed();
