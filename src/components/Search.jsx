import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Slider } from "./ui/slider";
import { Separator } from "@/components/ui/separator";
import { CiSearch, CiTrash } from "react-icons/ci";
import Data from "@/Shared/Data";
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

  function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [cars, setCars] = useState('');
    const [make, setMake] = useState('');
    const [price, setPrice] = useState(0);
    
    const priceValues = Data.Pricing.map(p => p.amount);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);

    // Khởi tạo giá trị mặc định
    useEffect(() => {
      setCars(searchParams.get('cars') || '');
      setMake(searchParams.get('make') || '');
      const urlPrice = searchParams.get('price');
      setPrice(urlPrice ? Number(urlPrice) : minPrice);
    }, [searchParams]);

    const handlePriceChange = (value) => {
      setPrice(value[0]);
    };

    const resetFilter = (type) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(type);
      navigate(`/search?${newParams.toString()}`);
      if(type === 'price') setPrice(minPrice);
    };

    // Tạo URL không bao gồm price khi ở mức mặc định
    const buildSearchUrl = () => {
      const params = new URLSearchParams();
      if(cars) params.set('cars', cars);
      if(make) params.set('make', make);
      if(price > minPrice) params.set('price', price);
      return `/search?${params.toString()}`;
    };

  return (
    <div className="p-4 bg-white rounded-4xl shadow-lg flex flex-col md:flex-row gap-3 items-center w-full max-w-4xl mx-auto">
      {/* Condition Filter */}
      <div className="relative group w-full md:w-auto">
        <Select value={cars} onValueChange={setCars}>
          <SelectTrigger className="w-full md:w-48 pr-8 outline-none md:border-none shadow-none text-lg ">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent className="bg-white outline-none border-none shadow-none rounded-md">
            <SelectItem  className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors" value="New">New</SelectItem>
            <SelectItem  className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors" value="Used">Used</SelectItem>
            <SelectItem  className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors" value="Certified Pre-Owned">Certified</SelectItem>
          </SelectContent>
        </Select>
        {cars && (
          <CiTrash
            className="absolute right-2 top-3 text-gray-400 hover:text-red-500 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
            onClick={() => resetFilter('cars')}
          />
        )}
      </div>

      <Separator className="md:h-8 md:w-px bg-gray-200" orientation="vertical" />

      {/* Make Filter */}
      <div className="relative group w-full md:w-auto">
        <Select value={make} onValueChange={setMake}>
          <SelectTrigger className="w-full md:w-48 pr-8 outline-none md:border-none shadow-none text-lg">
            <SelectValue placeholder="Car Make" />
          </SelectTrigger>
          <SelectContent className="bg-white outline-none border-none shadow-none rounded-md">
            {Data.CarMakes.map((maker) => (
              <SelectItem  className="hover:bg-gray-100 focus:bg-gray-200 cursor-pointer transition-colors" key={maker.name} value={maker.name}>
                {maker.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {make && (
          <CiTrash
            className="absolute right-2 top-3 text-gray-400 hover:text-red-500 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
            onClick={() => resetFilter('make')}
          />
        )}
      </div>

      <Separator className="md:h-8 md:w-px bg-gray-200" orientation="vertical" />

     {/* Price Slider */}
     <div className="relative w-full md:w-64 px-4">
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Max Price: 
              <span className="ml-1 text-blue-500 font-semibold">
                {price > minPrice ? `VND ${price.toLocaleString()}` : "Any"}
              </span>
            </span>
            {price > minPrice && (
              <CiTrash
                className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                onClick={() => resetFilter('price')}
              />
            )}
          </div>
          <div className="relative mt-2">
            <Slider
              defaultValue={[minPrice]}
              value={[price]}
              onValueChange={handlePriceChange}
              min={minPrice}
              max={maxPrice}
              step={1000}
              className="w-full h-2 bg-gray-200 rounded-lg focus:outline-none relative"
            >
              {price > minPrice && (
                <div
                  className="absolute top-[-20px] left-[50%] translate-x-[-50%] text-sm text-gray-600 font-medium"
                  style={{
                    left: `${((price - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  }}
                >
                  ${price.toLocaleString()}
                </div>
              )}
            </Slider>
          </div>
          {/* <div className="text-xs text-gray-400 text-right">
            Range: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
          </div> */}
        </div>
      </div>

      {/* Search Button */}
      <Link 
        to={buildSearchUrl()}
        className="w-full md:w-auto mt-4 md:mt-0"
      >
        <div className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 transition-all">
          <CiSearch className="text-2xl" />
          <span className="font-semibold">Search</span>
        </div>
      </Link>

      {/* Reset All */}
      {(cars || make || price > minPrice) && (
        <button
          onClick={() => navigate('/search')}
          className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 mt-2 md:mt-0 md:ml-4"
        >
          <CiTrash className="text-4xl" />
        </button>
      )}
    </div>
  );
}

export default Search;