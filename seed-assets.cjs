// seed-assets.js
// Run: node seed-assets.js
// Uploads Kenyan landmark images to Cloudinary and saves URLs to /data/seededImages.json

require("dotenv").config({ path: ".env.local" });
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = "bungoma_tours_assets";

// Curated public-domain Kenyan landmark images from Unsplash & Wikimedia
const KENYAN_LANDMARKS = [
  {
    name: "Mount Elgon National Park",
    slug: "mount-elgon",
    tags: ["mountain", "western-kenya", "bungoma"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mount_Elgon_Caldera.jpg/1280px-Mount_Elgon_Caldera.jpg",
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1280&q=80",
    ],
  },
  {
    name: "Nabuyole Falls",
    slug: "nabuyole-falls",
    tags: ["waterfall", "bungoma", "western-kenya"],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1280&q=80",
    ],
  },
  {
    name: "Maasai Mara National Reserve",
    slug: "maasai-mara",
    tags: ["wildlife", "safari", "rift-valley"],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1280&q=80",
      "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1280&q=80",
    ],
  },
  {
    name: "Diani Beach",
    slug: "diani-beach",
    tags: ["beach", "coastal", "mombasa"],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1280&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&q=80",
    ],
  },
  {
    name: "Kakamega Rainforest",
    slug: "kakamega-rainforest",
    tags: ["forest", "western-kenya", "nature"],
    images: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1280&q=80",
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=1280&q=80",
    ],
  },
  {
    name: "Lake Victoria",
    slug: "lake-victoria",
    tags: ["lake", "western-kenya", "fishing"],
    images: [
      "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=1280&q=80",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1280&q=80",
    ],
  },
];

async function uploadImage(url, attractionSlug, index) {
  try {
    console.log(`  ⬆️  Uploading image ${index + 1} for ${attractionSlug}...`);
    const result = await cloudinary.uploader.upload(url, {
      folder: FOLDER,
      public_id: `${attractionSlug}_${index + 1}`,
      overwrite: true,
      transformation: [
        {
          width: 1280,
          height: 720,
          crop: "fill",
          gravity: "auto",
          quality: "auto:good",
          format: "webp",
        },
      ],
    });
    console.log(`  ✅ Done: ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ❌ Failed: ${url}`, err.message);
    return null;
  }
}

async function main() {
  console.log("🌍 Bungoma Tours — Cloudinary Asset Seeder");
  console.log("==========================================\n");

  const seededData = [];

  for (const landmark of KENYAN_LANDMARKS) {
    console.log(`📍 Processing: ${landmark.name}`);
    const uploadedUrls = [];

    for (let i = 0; i < landmark.images.length; i++) {
      const url = await uploadImage(landmark.images[i], landmark.slug, i);
      if (url) uploadedUrls.push(url);
    }

    seededData.push({
      name: landmark.name,
      slug: landmark.slug,
      tags: landmark.tags,
      cloudinaryUrls: uploadedUrls,
    });

    console.log(`  📦 ${uploadedUrls.length}/${landmark.images.length} images uploaded\n`);
  }

  // Save to /data/seededImages.json
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, "seededImages.json");
  fs.writeFileSync(outputPath, JSON.stringify(seededData, null, 2));

  console.log("==========================================");
  console.log(`✅ Seeding complete! Results saved to: ${outputPath}`);
  console.log(`📊 Total attractions: ${seededData.length}`);
  console.log(`🖼️  Total images uploaded: ${seededData.reduce((acc, a) => acc + a.cloudinaryUrls.length, 0)}`);
}

main().catch(console.error);
