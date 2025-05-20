import React from 'react'
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";



const NUMERIC_FIELDS = [
  'year', 'mileage', 'door', 
  'sellingPrice', 'originalPrice',
  'engineSize', 'cylinder'
];

const FIELD_CONFIG = {
  year: { min: 1900, max: new Date().getFullYear() + 1 },
  door: { min: 2, max: 5 },
  engineSize: { step: 0.1 },
  mileage: { min: 0 },
  sellingPrice: { min: 0 },
  originalPrice: { min: 0 },
  cylinder: { min: 1, max: 12 },
};

function InputField({ item, handleInputChange, carInfo }) {
  const isNumeric = NUMERIC_FIELDS.includes(item.name);
  const [localValue, setLocalValue] = useState(
    carInfo?.[item.name] ?? ''
  );

  useEffect(() => {
    setLocalValue(carInfo?.[item.name] ?? '');
  }, [carInfo?.[item.name]]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);
    
    let processedValue = value;
    if (isNumeric) {
      processedValue = value === '' ? null : Number(value);
      if (isNaN(processedValue)) processedValue = null;
    }
    
    handleInputChange(item.name, processedValue);
  };

  return (
    <div className="relative">
      <Input
        type={isNumeric ? "number" : item.fieldType}
        name={item.name}
        required={item.required}
        value={localValue}
        onChange={handleChange}
        className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        placeholder={item.label}
        {...FIELD_CONFIG[item.name]}
      />
      
      
    </div>
  );
}

export default InputField;