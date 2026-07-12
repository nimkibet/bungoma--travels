const authConfig = {
  secret: process.env.AUTH_SECRET || "centstore_jwt_secret_key_2026_x_bungoma_tours_32bytes_fallback",
  pages: {
    signIn: "/user/login",
  },
  providers: [],
};

export default authConfig;
