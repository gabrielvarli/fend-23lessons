import Item from "./Item";
import Form from "./Form";
import useItems from "@/app/hooks/useItem";
import FilterBar from "./FilterBar";
import { useState } from "react";

const List = () => {
  const { items, fetchItems } = useItems(); // Hämta items från useItems hook
  const [filteredItems, setFilteredItems] = useState([]);

  // Hantera filtrering
  const handleFilterChange = (filterList) => {
    console.log("FilterList from FilterBar", filterList);
    setFilteredItems(filterList);
    console.log("Filtered items from FilterBar", filterList);
  };

  const _items = filteredItems.length > 0 ? filteredItems : items;
  console.log("Items from List", _items);

  return (
    <>
      {/* Form för att lägga till nya items */}
      <Form onItemChange={fetchItems} />

      {/* FilterBar komponent */}
      <FilterBar items={items} onFilterChange={handleFilterChange} />

      <div className="w-full mt-6">
        <ul>
          {/* Header för listan */}
          <div className="flex items-center justify-between w-full mb-4 bg-white">
            <p className="flex-1 text-start border border-gray-600 border-r p-2">
              Name:
            </p>
            <p className="flex-1 text-start border border-gray-600 border-l-0 p-2">
              Quantity:
            </p>
            <p className="flex-1 text-start border border-gray-600 border-l-0 border-r p-2">
              Category:
            </p>
            <p className="flex-1 text-start border border-gray-600 border-l-0 border-r p-2">
              Availability
            </p>
          </div>

          {/* Rendera filtrerade items om de finns, annars rendera alla */}
          {_items.map((item) => (
            <Item key={item.id} onItemChange={fetchItems} {...item} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default List;
