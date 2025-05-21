import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react";

function DropdownField({ item, handleInputChange, carInfo }) {
  const [selectedValue, setSelectedValue] = React.useState(
    carInfo?.[item.name] || ''
  );

  useEffect(() => {
    setSelectedValue(carInfo?.[item.name] || '');
  }, [carInfo?.[item.name]]);


  const handleChange = (value) => {
    setSelectedValue(value);
    handleInputChange(item.name, value);
  };

  return (
    <div className="relative group">
      <Select 
        onValueChange={handleChange} 
        value={selectedValue}
      >
        <SelectTrigger className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 group-hover:border-red-300 transition-colors">
          <SelectValue 
            placeholder={item.label} 
            className="text-gray-700"
          >
            {selectedValue || item.label}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="rounded-lg shadow-lg border border-gray-200 mt-1 bg-white">
          {item?.options?.map((option) => (
            <SelectItem 
              key={option}
              value={option}
              className="px-4 py-2.5 hover:bg-red-50/80 text-gray-700 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="absolute inset-0 pointer-events-none rounded-lg ring-0 group-focus-within:ring-2 ring-red-200 transition-shadow" />
    </div>
  );
}

export default DropdownField;