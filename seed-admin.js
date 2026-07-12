// seed-admin.js
// Run: node seed-admin.js
// Seeds the database with a default Admin user

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function main() {
  console.log("🌍 Bungoma Tours — MongoDB Admin User Seeder");
  console.log("===========================================\n");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // Define Inline Schemas to avoid ESM/Next.js export issues
  const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emails: [{
      email: { type: String, required: true },
      emailVerifiedAt: { type: Date, default: null },
      primary: { type: Boolean, default: false },
    }],
    profileImage: { type: String, required: true },
    coverImage: { type: String, default: "" },
    emailVerifiedAt: { type: Date, default: null },
    phoneNumbers: [],
    address: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
  }, { timestamps: true });

  const accountSchema = new mongoose.Schema({
    password: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    provider: { type: String, required: true, default: "credentials" },
    type: { type: String, required: true, default: "credentials" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  });

  const User = mongoose.models.User || mongoose.model("User", userSchema);
  const Account = mongoose.models.Account || mongoose.model("Account", accountSchema);

  const adminEmail = "admin@bungomatours.com";
  const adminPassword = "AdminPassword2026!";

  // Check if admin already exists
  const existingUser = await User.findOne({ email: adminEmail });
  if (existingUser) {
    console.log(`⚠️ User "${adminEmail}" already exists. Updating credentials...`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await Account.findOneAndUpdate(
      { userId: existingUser._id },
      { password: passwordHash, providerAccountId: adminEmail },
      { upsert: true }
    );
    console.log("✅ Admin credentials updated successfully!");
  } else {
    console.log("Creating new Admin user...");
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const newUser = await User.create({
      firstName: "Admin",
      lastName: "Bungoma",
      email: adminEmail,
      emails: [{ email: adminEmail, primary: true, emailVerifiedAt: new Date() }],
      emailVerifiedAt: new Date(),
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=75",
      coverImage: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=75",
    });

    await Account.create({
      userId: newUser._id,
      password: passwordHash,
      providerAccountId: adminEmail,
      provider: "credentials",
      type: "credentials",
    });

    console.log("✅ Admin user and credentials seeded successfully!");
  }

  console.log("\n===========================================");
  console.log("🔐 Credentials:");
  console.log(`📧 Email:    ${adminEmail}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log("===========================================");

  await mongoose.disconnect();
}

main().catch(console.error);
