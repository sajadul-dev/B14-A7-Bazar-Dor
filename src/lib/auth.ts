import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const databaseUrl = process.env.DB_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!databaseUrl) {
  throw new Error(
    "DB_URL is missing. Check your environment configuration."
  );
}

if (!authSecret) {
  throw new Error(
    "BETTER_AUTH_SECRET is missing. Check your environment configuration."
  );
}

/**
 * Reuse one MongoDB client within each running Node.js instance.
 * This cache is used in development and production.
 */

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(databaseUrl, {
    maxPoolSize: 10,
    minPoolSize: 0,
  });

globalForMongo.mongoClient = client;

const db = client.db(
  process.env.DB_NAME || "bazardor"
);

/**
 * Better Auth configuration
 */

export const auth = betterAuth({
  appName: "BazarDor",

  secret: authSecret,

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // GitHub OAuth account linking
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
});