"use client";

import { useAuth } from "@/context/auth";
import React, { useState } from "react";
// import FilterBarf from "./FilterBar";
const Form = ({ onItemChange }) => {
  const [newItem, setNewItem] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Rensa gamla felmeddelanden
    setLoading(true); // Sätt loading state

    const formData = new FormData(e.target);
    const item = {
      name: formData.get("item-name"),
      quantity: formData.get("quantity"),
      description: formData.get("description"),
      category: formData.get("category"),
    };

    if (!item.name || !item.quantity || !item.category) {
      setError("All fields must be filled out.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      if (onItemChange) {
        onItemChange(); // Trigger uppdatering
      }

      // Återställ formulärfält efter lyckad POST
      e.target.reset();
      setNewItem({});
    } catch (error) {
      console.error("Error adding item:", error);
      setError("Failed to add item. Try again.");
    } finally {
      setLoading(false); // Ta bort loading state
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex gap-10 mb-4">
        {/* Vänster sida - item details */}
        <div className="flex-3 flex flex-col gap-2 min-w-72 ">
          <label htmlFor="item-name">Name:</label>
          <input
            className="p-2 border border-black"
            id="item-name"
            name="item-name"
            type="text"
            placeholder="Items Name"
            required
          />

          <label htmlFor="quantity">Quantity:</label>
          <input
            className="p-2 border border-black"
            id="quantity"
            name="quantity"
            type="number"
            placeholder="8"
            min="1"
            required
          />

          <label htmlFor="category">Category:</label>
          <input
            className="p-2 border border-black"
            id="category"
            name="category"
            type="text"
            placeholder="Electronics"
            required
          />
        </div>

        {/* Höger sida - description */}
        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor="description">Description:</label>
          <textarea
            className="h-full p-2 placeholder:text-start resize-none border border-black"
            id="description"
            name="description"
            placeholder="Items from Amazon, we have everything you need!"
          />
        </div>
      </div>

      {/* Felmeddelande om något går fel */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Lägga till item-knapp */}
      <div className="flex gap-2 mb-4 justify-between">
        <button
          type="submit"
          disabled={loading} // Deaktivera knappen när det laddas
          className={`w-72 text-white px-4 rounded-md focus:outline-none focus:ring-2 p-2 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          {loading ? "Adding..." : "Add item"}
        </button>
      </div>
    </form>
  );
};

export default Form;
