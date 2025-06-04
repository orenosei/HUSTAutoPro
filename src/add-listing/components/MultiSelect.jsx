import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function MultiSelect({ options, selected, onChange, placeholder }) {
  const handleSelect = (value) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value, e) => {
    e.stopPropagation();
    onChange(selected.filter(v => v !== value));
  };

return (
    <div className="relative group">
        <Select onValueChange={handleSelect} value="">
        <SelectTrigger className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 group-hover:border-red-300 transition-colors">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-lg shadow-lg border border-gray-200 mt-1 bg-white">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={selected.includes(option.value)}
              className="px-4 py-2.5 hover:bg-red-50/80 text-gray-700 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"

            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex flex-wrap">
        {selected.map((value) => {
          const option = options.find(opt => opt.value === value);
          return (
            <Badge key={value} variant="secondary">
              {option?.label || value}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className=" border-gray-300 rounded-lg hover:bg-red-50/80 text-gray-500 ml-2"
                onClick={(e) => removeOption(value, e)}
              >
                <X />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}