import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch all items, with optional filtering by search term (name/quantity)
export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  try {
    let items;

    // Om 'search' parametern finns, filtrera på namn och kategori
    if (search) {
      items = await prisma.item.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: search, // Anpassa om kategori är en relation i din Prisma-modell
                mode: "insensitive",
              },
            },
          ],
        },
      });
    } else {
      // Om ingen sökparameter, hämta alla items
      items = await prisma.item.findMany();
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { message: "Error fetching items" },
      { status: 500 }
    );
  }
};

// POST: Add a new item
export const POST = async (req) => {
  let body;

  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  // TODO: Validera 'body' för att säkerställa att alla fält är korrekta
  const { name, quantity, category, description } = body;

  const userId = req.headers.get("userId");
  console.log(userId);

  if (!name || !quantity || !category || !description) {
    return NextResponse.json(
      { message: "Missing fields in request body" },
      { status: 400 }
    );
  }

  try {
    // Skapa nytt item i databasen
    const newItem = await prisma.item.create({
      data: {
        name,
        quantity: Number(quantity),
        inStock: Number(quantity) > 0, // Markera som i lager om quantity > 0
        category, // Om kategori är en relation, anpassa detta
        description,
        user: {
          connect: { id: Number(userId) },
        },
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { message: "Error creating item" },
      { status: 500 }
    );
  }
};

// PUT: Update an existing item
export const PUT = async (req) => {
  let body;

  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { id, name, quantity, category, description } = body;

  if (!id) {
    return NextResponse.json({ message: "Missing item ID" }, { status: 400 });
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        quantity: Number(quantity),
        inStock: Number(quantity) > 0,
        category,
        description,
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { message: "Error updating item" },
      { status: 500 }
    );
  }
};
