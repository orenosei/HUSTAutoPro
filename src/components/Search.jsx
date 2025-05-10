import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CiSearch } from "react-icons/ci";
import Data from "@/Shared/Data";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Search() {

  const [cars, setCars] = useState();
  const [make, setMake] = useState();
  const [price, setPrice] = useState();

  return (
    <div className="p-4 bg-white rounded-md md:rounded-full flex-col md:flex md:flex-row gap-10 px-5 items-center w-[60%]">
      {/* Dropdown 1 */}
      <Select onValueChange={(value) => setCars(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder="Cars" />
        </SelectTrigger>
        <SelectContent className="bg-white outline-none border-none shadow-none rounded-md">
          <SelectItem value="New"
          className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors"
          >
            New
          </SelectItem>
          <SelectItem value="Used"
            className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors"
          >
            Used
          </SelectItem>
          <SelectItem value="Certified Pre-Owned">
            Certified Pre-Owned
          </SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="hidden md:block" />

      {/* Dropdown 2 */}
      <Select onValueChange={(value) => setMake(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder="Car Makes" />
        </SelectTrigger>
        <SelectContent className="bg-white outline-none border-none shadow-none rounded-md">
          {Data.CarMakes.map((maker) => (
            <SelectItem
              key={maker.name}
              value={maker.name}
              className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors"
            >
              {maker.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="hidden md:block" />

      {/* Dropdown 3 */}
      <Select onValueChange={(value) => setPrice(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent className="bg-white outline-none border-none shadow-none rounded-md">
          {Data.Pricing.map((price) => (
            <SelectItem
              key={price.amount}
              value={price.amount}
              className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors"
            >
              {price.amount}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Button */}
    <Link to={'/search?cars=' + cars + '&make=' + make + '&price=' + price}>
      <CiSearch className="text-[50px] bg-blue-500 rounded-full p-3 text-white hover:scale-130 transition-all cursor-pointer" />
    </Link>
    </div>
  );
}

export default Search;
