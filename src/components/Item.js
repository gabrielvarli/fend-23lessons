import { useAuth } from "@/context/auth";
import React, { useState } from "react";
import EditItem from "./EditItem";
import Modal from "./Modal"; // Import the Modal component

const Item = ({
  onItemChange,
  name,
  description,
  quantity,
  id,
  inStock,
  category,
}) => {
  const auth = useAuth();
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false); // För att visa en loading-indikator
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // För bekräftelsedialog

  const itemToChange = {
    name,
    description,
    quantity,
    id,
    inStock,
    category,
  };

  // Bekräftelse för borttagning
  const confirmDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting item");
      }

      if (onItemChange) {
        onItemChange(); // Trigger uppdatering efter radering
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false); // Stäng bekräftelsedialogen
    }
  };

  const handleEdit = () => {
    setEdit(true); // Öppna redigeringsformuläret
  };

  const handleCloseEdit = () => {
    setEdit(false); // Stäng redigeringsformuläret
  };

  return (
    <>
      {!edit ? (
        <li className="mb-2 border border-gray-600 bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between w-full border-gray-600 border-b pb-2">
            <p className="flex-1 text-start p-2 border-gray-600 border-r">
              <strong>Name:</strong> {name}
            </p>
            <p className="flex-1 text-start p-2 border-gray-600 border-r">
              <strong>Quantity:</strong> {quantity}
            </p>
            <p className="flex-1 text-start p-2 border-gray-600 border-r">
              <strong>Category:</strong> {category}
            </p>
            <p className="flex-1 text-start p-2">
              <strong>Status:</strong> {inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          <div className="flex justify-between mt-2 bg-white">
            <p className="text-start p-2">{description}</p>
            <div className="flex p-1 gap-2">
              <button
                onClick={handleEdit}
                className="w-24 bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={confirmDelete}
                className="w-24 bg-red-600 text-white px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Modal för bekräftelse av radering */}
          {showDeleteConfirm && (
            <Modal
              message="Do u want to delete?"
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteConfirm(false)}
              loading={loading}
            />
          )}
        </li>
      ) : (
        <EditItem
          onClick={handleCloseEdit}
          id={id}
          name={name}
          description={description}
          quantity={quantity}
          setEdit={setEdit}
          item={itemToChange}
          onItemChange={onItemChange}
        />
      )}
    </>
  );
};

export default Item;
