import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Implement your authorization logic here
        // This is a placeholder, replace with your actual authentication
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" } // user object
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as "admin" | "user"
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/auth/error",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
