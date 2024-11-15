import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectDB from '@/lib/connectDB';
import User from '@/models/User';

async function saveGoogleUser(profile) {
  await connectDB();
  let user = await User.findOne({ email: profile.email });

  if (!user) {
    user = new User({ name: profile.name, email: profile.email, authType: 'google' });
    await user.save();
  } else {
    user.name = profile.name;
    user.authType = 'google';
    await user.save();
  }

  return user;
};

async function saveGithubUser(profile) {
  await connectDB();
  let user = await User.findOne({ email: profile.email });

  if (!user) {
    user = new User({ name: profile.name, email: profile.email, authType: 'github' });
    await user.save();
  } else {
    user.name = profile.name;
    user.authType = 'github';
    await user.save();
  }

  return user;
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id, name: user.name, email: user.email };
        }

        throw new Error("Invalid email or password");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,

      async profile(profile) {
        const user = await saveGoogleUser(profile);
        return { id: user._id, name: user.name, email: user.email };
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,

      async profile(profile) {
        const user = await saveGithubUser(profile);
        return { id: user._id, name: user.name, email: user.email };
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }

      if (account) {
        token.authType = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.authType = token.authType;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});