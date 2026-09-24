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
        // Use environment variables for production admin access
        const adminUser = process.env.ADMIN_USERNAME || "admin"
        const adminPass = process.env.ADMIN_PASSWORD || "password"

        if (credentials?.username === adminUser && credentials?.password === adminPass) {
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
    maxAge: 24 * 60 * 60, // 24 hours
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
