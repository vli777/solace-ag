import React from "react";

type SearchInputProps = {
  searchTerm: string;
  onSearch: () => void;
  onClear: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


export const SearchInput = ({ searchTerm, onSearch, onClear, onChange }: SearchInputProps) => {  
  return (
    <div className="relative w-full">
      <input
        className="border rounded p-2 w-full pr-10"
        placeholder="Search"
        value={searchTerm}
        onChange={onChange}
      />
      {searchTerm && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      )}
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
      >
        Search
      </button>
    </div>
  );
};

export default SearchInput;
