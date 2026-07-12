// seed-db.js
// Run: node seed-db.js
// Seeds MongoDB with Kenyan attractions using Cloudinary URLs from seededImages.json

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🌍 Bungoma Tours — MongoDB Attraction Seeder");
  console.log("===========================================\n");

  // Load Cloudinary URLs
  const seededPath = path.join(__dirname, "data", "seededImages.json");
  const seeded = JSON.parse(fs.readFileSync(seededPath, "utf-8"));
  const imageMap = Object.fromEntries(seeded.map(s => [s.slug, s.cloudinaryUrls]));

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Define inline schema (avoid ESM issues)
  const attractionSchema = new mongoose.Schema({
    title: String, slug: String, location: Object, description: String,
    shortDescription: String, images: [String], category: String,
    entryFee: Object, featured: Boolean, isActive: Boolean, seo: Object,
    openingHours: Object, facilities: [String], rating: Number, reviewCount: Number,
  }, { timestamps: true });

  const Attraction = mongoose.models.Attraction || mongoose.model("Attraction", attractionSchema);

  const attractions = [
    {
      title: "Mount Elgon National Park",
      slug: "mount-elgon",
      location: { county: "Bungoma", region: "Western Kenya", coordinates: { lat: 1.1368, lng: 34.5594 } },
      description: "Mount Elgon is a massive solitary volcano on the Uganda-Kenya border. Its huge, ancient caldera is the world's fourth largest at 40km across. The national park is home to elephants, buffalo, and over 300 bird species. The famous Kitum Cave, carved by elephants mining for salt, is one of Africa's most extraordinary natural phenomena. Trails through the afro-montane forest lead to spectacular crater lakes, hot springs, and the Wagagai Peak at 4,321m.",
      shortDescription: "Africa's oldest volcano with the world's largest caldera — home to salt-mining elephants and pristine alpine moorlands.",
      images: imageMap["mount-elgon"] || [],
      category: "Nature",
      entryFee: { citizen: 300, resident: 1500, foreigner: 3500, currency: "KES" },
      openingHours: { open: "06:00", close: "19:00", daysOpen: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      facilities: ["Camping Sites", "Guided Trails", "Bandas", "Information Centre", "Elephant Salt Caves"],
      featured: true, isActive: true, rating: 4.8, reviewCount: 342,
      seo: { metaTitle: "Mount Elgon National Park | Bungoma Tours Kenya", metaDescription: "Explore Mount Elgon — Africa's oldest volcano with the world's largest caldera, elephant caves, and stunning highland trails in Western Kenya." },
    },
    {
      title: "Nabuyole Falls (Singing Wells)",
      slug: "nabuyole-falls",
      location: { county: "Bungoma", region: "Western Kenya", coordinates: { lat: 0.5500, lng: 34.5200 } },
      description: "Nabuyole Falls, locally known as the 'Singing Wells', is a spectacular waterfall on the Nzoia River within Bungoma County. The falls cascade 10 metres into a dramatic gorge, creating a constant roar and fine mist. The surrounding area is lush with tropical vegetation and provides excellent bird watching opportunities. The site is considered sacred by local communities and holds deep cultural significance. Visitors can swim in designated pools below the falls and enjoy riverside picnics.",
      shortDescription: "Bungoma's most magnificent waterfall — the Nzoia River plunges 10m into the 'Singing Wells' gorge.",
      images: imageMap["nabuyole-falls"] || [],
      category: "Nature",
      entryFee: { citizen: 100, resident: 300, foreigner: 500, currency: "KES" },
      openingHours: { open: "07:00", close: "17:00", daysOpen: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      facilities: ["Picnic Areas", "Swimming Pools", "Footpaths", "Local Guides"],
      featured: true, isActive: true, rating: 4.6, reviewCount: 189,
      seo: { metaTitle: "Nabuyole Falls Bungoma | Bungoma Tours Kenya", metaDescription: "Visit Nabuyole Falls (Singing Wells) in Bungoma County — a sacred 10m waterfall on the Nzoia River surrounded by lush tropical vegetation." },
    },
    {
      title: "Maasai Mara National Reserve",
      slug: "maasai-mara",
      location: { county: "Narok", region: "Rift Valley", coordinates: { lat: -1.5048, lng: 35.1425 } },
      description: "The Maasai Mara is Kenya's most famous wildlife reserve, home to the spectacular Great Migration — the annual movement of over 1.5 million wildebeest, zebras, and gazelles across the Mara River. The reserve teems with the Big Five (lion, leopard, elephant, buffalo, rhino) and over 470 bird species. The vast savanna plains, dotted with acacia trees and bisected by the winding Mara River, provide arguably the world's finest wildlife viewing experience. Hot air balloon safaris at dawn offer an unforgettable perspective.",
      shortDescription: "Kenya's ultimate safari destination — witness the Great Migration and encounter the Big Five on the sweeping Mara plains.",
      images: imageMap["maasai-mara"] || [],
      category: "Wildlife",
      entryFee: { citizen: 800, resident: 2000, foreigner: 9000, currency: "KES" },
      openingHours: { open: "06:00", close: "18:00", daysOpen: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      facilities: ["Game Drives", "Balloon Safaris", "Luxury Camps", "Walking Safaris", "Cultural Village Visits"],
      featured: true, isActive: true, rating: 4.9, reviewCount: 2847,
      seo: { metaTitle: "Maasai Mara National Reserve | Bungoma Tours Kenya", metaDescription: "Book your Maasai Mara safari with Bungoma Tours. Witness the Great Migration, Big Five wildlife, and luxury tented camps in Kenya's most iconic reserve." },
    },
    {
      title: "Diani Beach",
      slug: "diani-beach",
      location: { county: "Kwale", region: "Coastal Kenya", coordinates: { lat: -4.2804, lng: 39.5805 } },
      description: "Diani Beach is repeatedly voted Africa's Leading Beach Destination. Stretching 17km along Kenya's Indian Ocean coast, this pristine white-sand paradise is lined with swaying palm trees and lapped by crystal-clear turquoise waters. The reef offshore creates perfect conditions for snorkelling, scuba diving, kitesurfing, and deep-sea fishing. The Colobus Conservation area nearby is home to rare Angolan colobus monkeys. World-class resorts, water sports, and Swahili seafood restaurants complete the experience.",
      shortDescription: "17km of pristine white-sand paradise on Kenya's Indian Ocean coast — Africa's leading beach destination.",
      images: imageMap["diani-beach"] || [],
      category: "Beach",
      entryFee: { citizen: 0, resident: 0, foreigner: 0, currency: "KES" },
      openingHours: { open: "00:00", close: "23:59", daysOpen: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      facilities: ["Water Sports", "Snorkelling", "Scuba Diving", "Beach Bars", "Restaurants", "Colobus Monkey Park"],
      featured: true, isActive: true, rating: 4.7, reviewCount: 1523,
      seo: { metaTitle: "Diani Beach Kenya | Bungoma Tours", metaDescription: "Discover Diani Beach — Kenya's most spectacular 17km stretch of white sand on the Indian Ocean coast. Perfect for snorkelling, diving, and water sports." },
    },
    {
      title: "Kakamega Rainforest",
      slug: "kakamega-rainforest",
      location: { county: "Kakamega", region: "Western Kenya", coordinates: { lat: 0.2725, lng: 34.8541 } },
      description: "Kakamega Forest is Kenya's only tropical rainforest and the easternmost remnant of the ancient Guineo-Congolian rainforest that once stretched across equatorial Africa. This 240 km² forest is extraordinarily biodiverse: home to 330+ bird species including the rare Great Blue Turaco, 400+ tree species, 7 species of primate including the Black-and-White Colobus, and hundreds of butterfly species. Guided forest walks reveal towering hardwoods, medicinal plants, and cascading forest streams in an atmosphere of primeval calm.",
      shortDescription: "Kenya's only tropical rainforest — a biodiversity hotspot with 330+ bird species, primates, and ancient equatorial trees.",
      images: imageMap["kakamega-rainforest"] || [],
      category: "Nature",
      entryFee: { citizen: 250, resident: 1000, foreigner: 2000, currency: "KES" },
      openingHours: { open: "06:00", close: "18:00", daysOpen: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      facilities: ["Guided Forest Walks", "Bird Watching", "Butterfly Trails", "Rest Bandas", "Research Centre"],
      featured: false, isActive: true, rating: 4.5, reviewCount: 267,
      seo: { metaTitle: "Kakamega Rainforest | Bungoma Tours Kenya", metaDescription: "Explore Kakamega Forest — Kenya's only tropical rainforest with 330+ bird species, colobus monkeys, and ancient Guineo-Congolian biodiversity." },
    },
    {
      title: "Lake Victoria",
      slug: "lake-victoria",
      location: { county: "Kisumu", region: "Nyanza Province", coordinates: { lat: -0.0917, lng: 34.7680 } },
      description: "Lake Victoria is the world's largest tropical lake and Africa's largest lake by area. The Kisumu waterfront provides access to boat trips across the lake to Rusinga Island, hippo watching at Hippo Point, and visits to the Impala Sanctuary. The lake supports over 200 species of fish including the Nile perch, and is a critical habitat for hippos, crocodiles, and water birds. A sunset cruise on the lake's glass-calm waters, with the vast horizon stretching to the horizon, is a deeply moving African experience.",
      shortDescription: "Africa's largest lake — offering boat trips, hippo watching, sunset cruises, and Kisumu's vibrant lakefront culture.",
      images: imageMap["lake-victoria"] || [],
      category: "Nature",
      entryFee: { citizen: 150, resident: 500, foreigner: 1500, currency: "KES" },
      openingHours: { open: "06:00", close: "18:00", daysOpen: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      facilities: ["Boat Trips", "Hippo Point", "Impala Sanctuary", "Fishing Excursions", "Sunset Cruises"],
      featured: false, isActive: true, rating: 4.3, reviewCount: 445,
      seo: { metaTitle: "Lake Victoria Kenya | Bungoma Tours", metaDescription: "Visit Lake Victoria — Africa's largest lake. Book boat trips, hippo watching, and sunset cruises from Kisumu with Bungoma Tours." },
    },
  ];

  let seededCount = 0;
  for (const data of attractions) {
    try {
      await Attraction.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true });
      console.log(`  ✅ Seeded: ${data.title}`);
      seededCount++;
    } catch (err) {
      console.error(`  ❌ Failed: ${data.title}`, err.message);
    }
  }

  console.log(`\n✅ Database seeding complete! ${seededCount}/${attractions.length} attractions seeded.`);
  await mongoose.disconnect();
}

main().catch(console.error);
