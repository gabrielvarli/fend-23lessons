import React from "react";

const Modal = ({ message, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p>{message}</p>
        <div className="flex justify-end mt-4 gap-2">
          <button
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
