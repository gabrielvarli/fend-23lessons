import React, { useState, useEffect } from "react";

const FilterBar = ({ items = [], onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(""); // Category filter state
  const [isInStock, setIsInStock] = useState(false); // Stock availability filter state

  useEffect(() => {
    const filteredList = items.filter((item) => {
      const categoryMatch = selectedCategory
        ? item.category === selectedCategory
        : true;
      const stockMatch = isInStock ? item.inStock : true;

      return categoryMatch && stockMatch;
    });
    onFilterChange(filteredList);
  }, [items, selectedCategory, isInStock, onFilterChange]);
  // Update category filter
  const onCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Extract unique categories from the items
  const uniqueCategories = Array.from(
    new Set(items.map((item) => item.category))
  );

  // Update stock filter
  const onInStockChange = (e) => {
    setIsInStock(e.target.checked);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
      {/* Category Filter */}
      <div className="flex items-center">
        <label htmlFor="categoryChoice" className="mr-2 font-medium">
          Category:
        </label>
        <select
          name="categoryChoice"
          id="categoryChoice"
          className="border border-gray-400 rounded-md px-2 py-1"
          onChange={onCategoryChange}
          value={selectedCategory}
        >
          <option value="">All categories</option>
          {uniqueCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* In-Stock Filter */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isInStock"
          id="isInStock"
          onChange={onInStockChange}
          checked={isInStock}
          className="mr-2"
        />
        <label htmlFor="isInStock" className="font-medium">
          In Stock
        </label>
      </div>
    </div>
  );
};

export default FilterBar;
