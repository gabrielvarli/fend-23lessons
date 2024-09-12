// skapa api-rutter för autentisering

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  // Registrering
  if (req.url.endsWith("/register")) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return new Response(JSON.stringify(user), { status: 201 });
  }

  // Inloggning
  if (req.url.endsWith("/login")) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "3h",
      });
      return new Response(JSON.stringify({ token, user }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }
}
