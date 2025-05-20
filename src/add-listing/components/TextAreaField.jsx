import React from 'react'
import {Textarea} from "@/components/ui/textarea"
import { useState, useEffect } from "react";

function TextAreaField({ item, handleInputChange, carInfo }) {
  const [value, setValue] = useState(carInfo?.[item.name] || '');

  useEffect(() => {
    setValue(carInfo?.[item.name] || '');
  }, [carInfo?.[item.name]]);

  return (
    <Textarea
    className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        handleInputChange(item.name, e.target.value);
      }}
    />
  );
}

export default TextAreaField
