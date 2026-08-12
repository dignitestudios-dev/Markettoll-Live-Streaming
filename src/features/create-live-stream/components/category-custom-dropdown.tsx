"use client";

import React, { useState, useRef, useEffect } from "react";
import { useProductCategoriesQuery } from "../api/product-categories.queries";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import { IoSearchOutline, IoFolderOpenOutline } from "react-icons/io5";

interface CategoryCustomDropdownProps {
  value: string;
  onChange: (categoryName: string) => void;
  error?: string;
}

export default function CategoryCustomDropdown({
  value,
  onChange,
  error,
}: CategoryCustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [], isLoading } = useProductCategoriesQuery();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const selectedCategory = categories.find((cat) => cat.name === value);

  const handleSelect = (categoryName: string) => {
    onChange(categoryName);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-[52px] px-4 rounded-[16px] bg-white border text-sm text-left flex items-center justify-between transition-all cursor-pointer ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
            : isOpen
            ? "border-[#003DAC] ring-2 ring-[#003DAC]/10"
            : "border-gray-200/90 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {selectedCategory?.image ? (
            <img
              src={selectedCategory.image}
              alt={selectedCategory.name}
              className="w-6 h-6 rounded-md object-cover border border-gray-100 flex-shrink-0"
            />
          ) : (
            <IoFolderOpenOutline className="text-gray-400 text-lg flex-shrink-0" />
          )}

          <span
            className={`truncate font-medium ${
              value ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {value || "Select Category"}
          </span>
        </div>

        <IoIosArrowDown
          className={`text-gray-500 text-base transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-[#003DAC]" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[60px] z-50 p-2.5 bg-white border border-gray-100/90 rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Search Filter Input (if categories > 4) */}
          {categories.length > 4 && (
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0098EA] transition-all"
              />
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            </div>
          )}

          {/* Categories List */}
          <div className="max-h-[220px] overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
            {isLoading ? (
              <div className="p-4 text-center text-xs font-medium text-gray-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#0098EA] border-t-transparent rounded-full animate-spin" />
                Loading categories...
              </div>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isSelected = cat.name === value;
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => handleSelect(cat.name)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#003DAC]/10 text-[#003DAC] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#0098EA]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-6 h-6 rounded-md object-cover border border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <IoFolderOpenOutline className="text-gray-400 text-base flex-shrink-0" />
                      )}
                      <span className="truncate">{cat.name}</span>
                    </div>

                    {isSelected && (
                      <IoMdCheckmark className="text-[#003DAC] text-base flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">
                No categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
