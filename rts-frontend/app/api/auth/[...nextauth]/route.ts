import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple mock authentication for development
        // In a real app, you would verify against your backend or use OAuth
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return { id: "1", name: "RTS Admin", email: "admin@rts.local" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
