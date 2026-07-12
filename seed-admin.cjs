require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// We have to define the schema since we are in a CJS script and models use ESM imports
const emailSchema = new mongoose.Schema({
  _id: false,
  email: { type: String, required: true, unique: true },
  emailVerifiedAt: { type: Date, required: false, default: null },
  primary: { type: Boolean, default: false },
  inVerification: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emails: [emailSchema],
  profileImage: { type: String, required: true },
  role: { type: String, default: "user" }, // I'll add a role field if they want it later
}, { strict: false });

const accountsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  type: { type: String, required: true },
  password: { type: String },
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Account = mongoose.models.Account || mongoose.model('Account', accountsSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = "nimrodkibet376@gmail.com";
    const password = "Nimrod123";
    const passwordHash = await bcrypt.hash(password, 10);
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName: "Nimrod",
        lastName: "Kibet",
        email: email,
        emails: [{ email, primary: true }],
        profileImage: "https://via.placeholder.com/150",
        role: "admin", // Might be useful later
      });
      console.log("User created:", user._id);
    } else {
      user.role = "admin";
      await user.save();
      console.log("User already exists:", user._id);
    }

    const account = await Account.findOne({ userId: user._id, provider: "credentials" });
    if (!account) {
      await Account.create({
        userId: user._id,
        provider: "credentials",
        providerAccountId: user._id,
        type: "credentials",
        password: passwordHash
      });
      console.log("Account created");
    } else {
      account.password = passwordHash;
      await account.save();
      console.log("Account password updated");
    }

    console.log("Admin seeded successfully");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
