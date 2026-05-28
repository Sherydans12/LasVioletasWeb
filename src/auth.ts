import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { HIDDEN_LOGIN_PATH } from "@/lib/auth-routes";
import { ensureInitialAdmin } from "@/lib/admin-seed";
import { prisma } from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
        turnstileToken: { label: "Turnstile", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const turnstileToken = credentials?.turnstileToken as
          | string
          | undefined;

        const turnstileOk = await verifyTurnstileToken(turnstileToken);
        if (!turnstileOk) return null;

        if (!email || !password) return null;

        await ensureInitialAdmin();

        const admin = await prisma.admin.findUnique({
          where: { email: email.trim().toLowerCase() },
        });

        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: "Administrador",
        };
      },
    }),
  ],
  pages: {
    signIn: HIDDEN_LOGIN_PATH,
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = (token.email as string) ?? session.user.email;
      }
      return session;
    },
    authorized({ auth, request }) {
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return !!auth;
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
});
