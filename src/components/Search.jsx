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

function Search() {
  return (
    <div className="p-4 bg-white rounded-md md:rounded-full flex-col md:flex md:flex-row gap-10 px-5 items-center w-[60%]">
      {/* Dropdown 1 */}
      <Select>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder="Cars" />
        </SelectTrigger>
        <SelectContent className="bg-white outline-none border-none shadow-none rounded-md">
          <SelectItem
            value="light"
            className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors"
          >
            New
          </SelectItem>
          <SelectItem
            value="dark"
            className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors"
          >
            Old
          </SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="hidden md:block" />

      {/* Dropdown 2 */}
      <Select>
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
      <Select>
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
      <div>
        <CiSearch className="text-[50px] bg-blue-500 rounded-full p-3 text-white hover:scale-130 transition-all cursor-pointer" />
      </div>
    </div>
  );
}

export default Search;
