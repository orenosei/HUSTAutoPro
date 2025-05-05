import React from 'react'
import {Textarea} from "@/components/ui/textarea"

function TextAreaField({item,handleInputChange}) {
  return (
    <div>
      <Textarea onChange={(e)=>handleInputChange(item.name,e.target.value)}
      required={item.required} />
    </div>
  )
}

export default TextAreaField
