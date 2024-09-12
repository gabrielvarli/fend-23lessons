"use client";
import { useAuth } from "@/context/auth"; // Anpassa efter din auth-context-väg
import React, { useState } from "react";

const Model = ({ item, setEdit, onItemChange }) => {
  const auth = useAuth(); // Hämta auth-context
  const [newName, setNewName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [description, setDescription] = useState(item.description);
  const [isLoading, setIsLoading] = useState(false); // För att hantera sparningsstatus

  const handleClose = () => {
    setEdit(false); // Stänger modal
  };

  // PUT: Sparar ändringar
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Startar laddningsstatus
    const id = item.id;

    const updatedItem = {
      name: newName,
      category: category,
      quantity: Number(quantity), // Säkerställer att quantity är ett nummer
      description: description,
    };

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`, // Kolla att auth.token finns
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error("Failed to update the item");
      }

      if (onItemChange) {
        onItemChange(); // Uppdatera listan
      }

      setEdit(false); // Stänger modal efter lyckad uppdatering
    } catch (error) {
      console.error(error.message); // Tydligare felmeddelande
    } finally {
      setIsLoading(false); // Stoppar laddningsstatus
    }
  };

  return (
    <div className="mb-2 border border-gray-600">
      <div className="flex items-center w-full border-b border-gray-600">
        <input
          value={newName}
          type="text"
          className="flex-1 text-start p-2 border-gray-600 border-r"
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          value={quantity}
          type="number"
          className="flex-1 text-start p-2 border-gray-600 border-r"
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          value={category}
          type="text"
          className="flex-1 text-start p-2 border-gray-600"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <textarea
          value={description}
          className="flex-1 text-start p-2 resize-none w-full"
          rows={2}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="flex p-1 gap-2">
          <button
            onClick={handleSave}
            disabled={isLoading} // Deaktivera knappen under laddning
            className={`w-24 text-white px-4 rounded-md focus:outline-none focus:ring-2 ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            className="w-24 bg-red-600 text-white px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;
