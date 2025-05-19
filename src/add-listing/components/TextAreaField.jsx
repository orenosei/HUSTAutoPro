import React from 'react'
import {Textarea} from "@/components/ui/textarea"

function TextAreaField({item,handleInputChange,carInfo}) {
  return (
    <div>
      <Textarea className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 group-hover:border-blue-300 transition-colors" onChange={(e)=>handleInputChange(item.name,e.target.value)}
      required={item.required} 
      defaultValue={carInfo?.[item.name]}/>
    </div>
  )
}

export default TextAreaField
