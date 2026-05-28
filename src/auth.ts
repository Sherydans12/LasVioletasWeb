import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
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

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!email || !password || !adminEmail || email !== adminEmail) {
          return null;
        }

        let valid = false;
        if (adminPasswordHash) {
          valid = await bcrypt.compare(password, adminPasswordHash);
        } else if (adminPassword) {
          valid = password === adminPassword;
        }

        if (!valid) return null;

        return {
          id: "admin",
          email: adminEmail,
          name: "Administrador",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return !!auth;
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
});
