import { useState, useEffect } from "react";

const useItems = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.log("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, fetchItems };
};

export default useItems;
