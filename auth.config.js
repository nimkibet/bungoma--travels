const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/user/login",
  },
  providers: [],
};

export default authConfig;
