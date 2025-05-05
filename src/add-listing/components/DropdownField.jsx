import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function DropdownField({item, handleInputChange}) {
  return (
    <div>
        <Select onValueChange={(value)=>handleInputChange(item.name, value)}
            required={item.required}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={item.label} />
        </SelectTrigger>
        <SelectContent className="bg-white outline-none  shadow-none rounded-md">
            {item?.options?.map((option, index)=>(
                <SelectItem className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors" value={option}>{option}</SelectItem>
            ))}
        </SelectContent>
         </Select>

    </div>
  )
}

export default DropdownField
