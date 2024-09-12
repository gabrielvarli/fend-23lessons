import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function GET({ headers }) {
  // Extract the Authorization header
  const authHeader = headers.get("authorization");

  // Check if the Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and extract the payload
    const payload = await verifyJWT(token);
    const userId = payload.userId;
    console.log(payload.userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the database using the userId from the token
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // If user not found, return a 404 error
    //TODO write helper function for 404s
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user);
  } catch (error) {
    // If the token verification fails, return a 401 error
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
