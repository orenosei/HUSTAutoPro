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
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState('');
  const [make, setMake] = useState('');
  const [price, setPrice] = useState(0);
  
  const priceValues = Data.Pricing.map(p => p.amount);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);

  const [isExpanded, setIsExpanded] = useState(false);
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [driveType, setDriveType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [color, setColor] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mileage, setMileage] = useState('');

  const bodyTypes = Data.BodyTypes || [];
  const transmissions = Data.Transmissions || [];
  const driveTypes = Data.DriveTypes || [];
  const fuelTypes = Data.FuelTypes || [];
  const colors = Data.Colors || [];

  useEffect(() => {
    setCars(searchParams.get('cars') || '');
    setMake(searchParams.get('make') || '');
    const urlPrice = searchParams.get('price');
    setPrice(urlPrice ? Number(urlPrice) : minPrice);
    setMinYear(searchParams.get('minYear') || '');
    setMaxYear(searchParams.get('maxYear') || '');
    setBodyType(searchParams.get('bodyType') || '');
    setTransmission(searchParams.get('transmission') || '');
    setDriveType(searchParams.get('driveType') || '');
    setFuelType(searchParams.get('fuelType') || '');
    setColor(searchParams.get('color') || '');
    setKeyword(searchParams.get('keyword') || '');
    setMileage(searchParams.get('mileage') || '');
  }, [searchParams]);

  const handlePriceChange = (value) => {
    setPrice(value[0]);
  };

  const resetAllFilters = () => {
    navigate('/search');
    setCars('');
    setMake('');
    setPrice(minPrice);
    setMinYear('');
    setMaxYear('');
    setBodyType('');
    setTransmission('');
    setDriveType('');
    setFuelType('');
    setColor('');
    setKeyword('');
    setMileage('');
  };

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if(cars) params.set('cars', cars);
    if(make) params.set('make', make);
    if(price > minPrice) params.set('price', price);
    if(minYear) params.set('minYear', minYear);
    if(maxYear) params.set('maxYear', maxYear);
    if(bodyType) params.set('bodyType', bodyType);
    if(transmission) params.set('transmission', transmission);
    if(driveType) params.set('driveType', driveType);
    if(fuelType) params.set('fuelType', fuelType);
    if(color) params.set('color', color);
    if(keyword) params.set('keyword', keyword);
    if(mileage) params.set('mileage', mileage);
    return `/search?${params.toString()}`;
  };

  return (
    <div className="pt-4 pl-4 pr-4 bg-white rounded-4xl shadow-xl flex flex-col items-center w-full max-w-7xl mx-auto border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0">
        {/* Condition Filter */}
        <div className="relative group md:w-auto w-full flex items-center">
          <Select value={cars} onValueChange={setCars}>
            <SelectTrigger className="md:w-60 pr-8 p-6 outline-none border border-gray-200 shadow-sm text-md font-medium text-gray-600 whitespace-nowrap h-14 rounded-xl bg-gray-50">
              <SelectValue placeholder="Tình Trạng" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
              <SelectItem value="Xe Mới">Xe Mới</SelectItem>
              <SelectItem value="Xe Cũ">Xe Cũ</SelectItem>
            </SelectContent>
          </Select>
          {cars && (
            <CiTrash
              className="ml-2 cursor-pointer transition-all text-gray-500 hover:text-red-500"
              onClick={() => setCars('')}
              size={20}
            />
          )}
        </div>

        <Separator className="md:h-10 md:w-px bg-gray-200 mx-2" orientation="vertical" />
    
        {/* Make Filter */}
        <div className="relative group md:w-auto w-full flex items-center">
          <Select value={make} onValueChange={setMake}>
            <SelectTrigger className="w-full md:w-60 pr-8 p-6 outline-none border border-gray-200 shadow-sm text-md font-medium text-gray-600 whitespace-nowrap h-14 rounded-xl bg-gray-50">
              <SelectValue placeholder="Hãng Xe" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
              {Data.CarMakes.map((maker) => (
                <SelectItem className="hover:bg-gray-100 py-2 px-4" key={maker.name} value={maker.name}>
                  {maker.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {make && (
            <CiTrash
              className="ml-2 cursor-pointer transition-all text-gray-500 hover:text-red-500"
              onClick={() => setMake('')}
              size={20}
            />
          )}
        </div>

        <Separator className="md:h-10 md:w-px bg-gray-200 mx-2" orientation="vertical" />

        {/* Price Slider */}
        <div className="relative group w-full md:w-96 px-4">
          <div className="p-4 bg-gray-50 border border-gray-200 shadow-sm rounded-xl flex flex-col h-full justify-center">
            <div className="flex justify-between items-center mb-2">
              <span className="text-md font-medium text-gray-600">
                Giá tối đa:
              </span>
              <span className="text-red-500 font-semibold">
                {price > minPrice ? `${price.toLocaleString()} VNĐ` : "Bất kỳ"}
              </span>
            </div>
            <Slider
              defaultValue={[minPrice]}
              value={[price]}
              onValueChange={handlePriceChange}
              min={minPrice}
              max={maxPrice}
              step={1000}
              className="w-full h-2 bg-gray-200 rounded-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <Link 
          to={buildSearchUrl()}
          className="w-full md:w-auto mt-4 md:mt-0"
        >
          <div className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 transition-all h-14 min-w-[140px] shadow-md hover:shadow-lg">
            <CiSearch className="text-2xl" />
            <span className="font-semibold">Tìm Kiếm</span>
          </div>
        </Link>

        {/* Reset All */}
        <button
          onClick={resetAllFilters}
          className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 mt-2 md:mt-0 md:ml-2"
          aria-label="Reset filters"
        >
          <CiTrash className="text-2xl" />
        </button>
      </div>

      {/* Expand button */}
      <div className="flex justify-center w-full">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-gray-500 text-lg hover:text-red-500 rounded-lg hover:bg-gray-50"
        >
          {isExpanded ? (
            <>
              <IoIosArrowUp className="ml-1" />
            </>
          ) : (
            <>
              <IoIosArrowDown className="ml-1" />
            </>
          )}
        </button>
      </div>

      <div className={`w-full transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px] p-4' : 'max-h-0'}`}>
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-t border-gray-200">
            {/* Keyword search */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm theo từ khóa..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
              />
              {keyword && (
                <CiTrash
                  className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => setKeyword('')}
                  size={20}
                />
              )}
            </div>

            {/* Year range */}
            <div className="flex gap-3">
              <div className="relative flex items-center flex-1">
                <input
                  type="number"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  placeholder="Từ năm"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                {minYear && (
                  <CiTrash
                    className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() => setMinYear('')}
                    size={20}
                  />
                )}
              </div>
              <div className="relative flex items-center flex-1">
                <input
                  type="number"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  placeholder="Đến năm"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                {maxYear && (
                  <CiTrash
                    className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() => setMaxYear('')}
                    size={20}
                  />
                )}
              </div>
            </div>

            {/* Body Type */}
            <div className="relative flex items-center">
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger className="w-full p-6 pr-8 border border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-600">
                  <SelectValue placeholder="Dáng xe" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                  {bodyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bodyType && (
                <CiTrash
                  className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => setBodyType('')}
                  size={20}
                />
              )}
            </div>

            {/* Transmission */}
            <div className="relative flex items-center">
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger className="w-full p-6 pr-8 border border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-600">
                  <SelectValue placeholder="Hộp số" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                  {transmissions.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {transmission && (
                <CiTrash
                  className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => setTransmission('')}
                  size={20}
                />
              )}
            </div>

            {/* Drive Type */}
            <div className="relative flex items-center">
              <Select value={driveType} onValueChange={setDriveType}>
                <SelectTrigger className="w-full p-6 pr-8 border border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-600">
                  <SelectValue placeholder="Dẫn động" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                  {driveTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {driveType && (
                <CiTrash
                  className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => setDriveType('')}
                  size={20}
                />
              )}
            </div>

            {/* Fuel Type */}
            <div className="relative flex items-center">
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger className="w-full p-6 pr-8 border border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-600">
                  <SelectValue placeholder="Nhiên liệu" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fuelType && (
                <CiTrash
                  className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => setFuelType('')}
                  size={20}
                />
              )}
            </div>

            {/* Color */}
            <div className="relative flex items-center">
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="w-full p-6 pr-8 border border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-600">
                  <SelectValue placeholder="Màu sắc" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1">
                  {colors.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {color && (
                <CiTrash
                  className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => setColor('')}
                  size={20}
                />
              )}
            </div>
            {/* Mileage */}
            <div className="relative flex items-center">
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Số dặm đã đi"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
              />
              {mileage && (
                <CiTrash
                  className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => setMileage('')}
                  size={20}
                />
              )}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;