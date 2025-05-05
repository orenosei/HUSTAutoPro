import Header from '@/components/Header'
import React from 'react'
import carDetails from './../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import features from './../Shared/features.json'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useState } from 'react'


function AddListing() {

    const[formData,setFormData]=useState([]);
    const handleInputChange=(name, value)=>{
        setFormData((prevData)=>({
            ...prevData,
            [name]:value
        }))
        console.log(formData);
    }

    const onSubmit=(e)=>{
        e.preventDefault();
        console.log(formData);
    }
  return (
    <div>
        <Header/>
        <div className= 'px-10 md:px-20 my-10'>
            <h2 className= 'font-blod text-4xl'>Add New Listing</h2>
            <form className= 'p-10 border rounded-xl mt-10'>
                {/* Car Details */}
                <div>
                    <h2 className='font-medium text-xl mb-6'>Car Details</h2>
                    <div className= 'grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {carDetails.carDetails.map((item,index)=>(
                            <div key ={index}>
                                <label className='text-sm'>{item?.label} {item.required&&<span className='text-red-500'>*</span>}</label>
                                {item.fieldType=='text'||item.fieldType=='number'
                                ?<InputField item ={item} handleInputChange={handleInputChange}/>
                                :item.fieldType=='dropdown'
                                ?<DropdownField item={item} handleInputChange={handleInputChange}/>
                                :item.fieldType=='textarea'
                                ?<Textarea item={item} handleInputChange={handleInputChange}/>
                                :null}
                            </div>
                        ))}
                    </div>
                </div>
                <Separator className="my-6" />
                {/* features List */}
                <div>
                    <h2 className= 'font-medium text-xl my-6'>Features</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                        {features.features.map((item,index)=>(
                            <div key={index} className='flex gap-2 items-center'>
                                <Checkbox onCheckedChange={(value)=>handleInputChange(item.name,value)}/> <h2>{item.label}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Car Images*/}
                <div className='mt-10 flex justify-end'>
                    <Button className='bg-blue-500 text-white hover:scale-110' onClick={(e)=>onSubmit(e)}>Submit</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddListing
