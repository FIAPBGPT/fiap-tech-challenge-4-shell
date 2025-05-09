import NextAuth, { NextAuthOptions } from "next-auth";
import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Configuration options for NextAuth authentication.
 *
 * This object defines the authentication providers, session handling, and callbacks
 * for the NextAuth library. It includes a credentials provider for user login,
 * session management using JWT, and custom callbacks for token and session handling.
 *
 * @constant
 * @type {NextAuthOptions}
 *
 * @property {Array} providers - An array of authentication providers. In this case, it includes
 * a `CredentialsProvider` for email and password-based authentication.
 *
 * @property {string} secret - The secret used to sign and encrypt tokens. It is retrieved from
 * the `NEXTAUTH_SECRET` environment variable.
 *
 * @property {Object} pages - Custom pages for authentication flows.
 * @property {string} pages.signIn - The path to the sign-in page.
 * @property {string} pages.error - The path to the error page.
 *
 * @property {Object} session - Configuration for session handling.
 * @property {string} session.strategy - The session strategy, set to "jwt" for JSON Web Tokens.
 *
 * @property {Object} callbacks - Custom callback functions for handling tokens and sessions.
 * @property {Function} callbacks.jwt - A callback to handle JWT token updates. It merges user
 * data into the token during login or session updates.
 * @property {Function} callbacks.session - A callback to handle session updates. It maps token
 * data to the session object, ensuring all required properties are included and properly typed.
 *
 * @example
 * // Example usage of the credentials provider
 * const credentials = {
 *   email: "user@example.com",
 *   password: "password123",
 * };
 * const user = await authorize(credentials);
 *
 * @throws {Error} If email or password is missing during authorization.
 * @throws {Error} If the API URL is not defined in the environment variables.
 * @throws {Error} If an error occurs during the login process.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const apiUrl =
          process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_NEXTAUTH_URL;

        if (!apiUrl) {
          throw new Error("API URL is not defined");
        }

        try {
          const response = await axios.post(
            `${apiUrl}/api/users/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { result } = response.data;
          if (result) {
            return result;
          } else {
            console.error("Error: Invalid response data");
            return null;
          }
        } catch (error: unknown) {
          const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : "Error during login";
          console.error("Login error:", errorMessage);
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user };
      }
      return user ? { ...token, ...user } : token;
    },
    async session({ session, token }) {
      session.user = {
        ...token,
        id: token.id,
        email: token.email,
        name: token.name || "", // Provide a default value for name
        result: token.result,
        access_token: String(token.access_token || ""), // Explicitly cast access_token to a string
        refresh_token: String(token.refresh_token || ""), // Explicitly cast refresh_token to a string
        expires_on: token.expires_on !== undefined ? token.expires_on : 0, // Ensure expires_on is always a number
        exp: token.exp !== null && token.exp !== undefined ? token.exp : 0,
        iat: token.iat || null,
        jti: token.jti || null,
      } as {
        id: string;
        email: string;
        name: string; // Ensure name is always a string
        result: { [key: string]: unknown }; // Replace with the actual structure of the result object
        access_token: string; // Make access_token required
        refresh_token: string; // Make refresh_token required
        expires_on: number; // Make expires_on optional
        exp: number;
        iat: number;
        jti: string;
      }; // Ensure all required properties are included
      return session;
    },
  },
};

export default NextAuth(authOptions);
