import { type User } from "@prisma/client";
import {
  clerkClient,
  currentUser,
  auth,
  type User as ClerkUser,
} from "@clerk/nextjs/server";
import { db } from "@/server/db";

export async function getClerkUserFromId(id: string) {
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(id);
  return clerkUser;
}

export async function getClerkUser(user: User) {
  const clerkUser = await getClerkUserFromId(user.id);
  return clerkUser;
}

export const getClerkEmail = (clerkUser: ClerkUser) => {
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email found for user");
  }
  return email;
};

export async function getClerkUserEmail(user: User) {
  const clerkUser = await getClerkUser(user);
  if (!clerkUser) {
    return null;
  }
  return getClerkEmail(clerkUser);
}

export async function getCurrentUser() {
  // const clerkUser = await currentUser();
  const { userId: clerkUserId } = await auth();

  let dbUser: User | null = null;

  // Always check if we have the user in our database
  if (clerkUserId) {
    try {
      dbUser = await db.user.findUnique({
        where: { id: clerkUserId },
      });

      if (!dbUser) {
        const clerkUser = await getClerkUserFromId(clerkUserId);
        const primaryEmail = getClerkEmail(clerkUser);
        dbUser = await db.user.create({
          data: {
            email: primaryEmail,
            id: clerkUser.id,
          },
        });
      }
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw new Error("Failed to get or create user");
    }
  }

  return { user: dbUser };
}
