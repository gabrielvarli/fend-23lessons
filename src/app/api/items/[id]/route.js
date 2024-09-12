import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch a specific item by its ID
export const GET = async (req, { params }) => {
  const { id } = params; // Få 'id' från params

  try {
    // Hämta item med specifikt id
    const item = await prisma.item.findUnique({
      where: { id: Number(id) }, // Konvertera id till ett nummer
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { message: "Error fetching item" },
      { status: 500 }
    );
  }
};

// PUT: Update a specific item by its ID
export const PUT = async (req, { params }) => {
  const { id } = params; // Få 'id' från params

  try {
    // Hämta uppdaterad data från request body
    const { name, quantity, description, category /*inStock*/ } =
      await req.json();

    // Uppdatera item med specifikt id
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) }, // Konvertera id till ett nummer
      data: {
        name,
        quantity: Number(quantity), // Konvertera quantity till nummer
        description,
        category,
        inStock: Number(quantity) > 0, // Markera som i lager om quantity > 0
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

// DELETE: Delete a specific item by its ID
export const DELETE = async (req, { params }) => {
  const { id } = params; // Få 'id' från params

  try {
    // Ta bort item med specifikt id
    await prisma.item.delete({
      where: { id: Number(id) }, // Konvertera id till ett nummer
    });

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { message: "Error deleting item" },
      { status: 500 }
    );
  }
};
