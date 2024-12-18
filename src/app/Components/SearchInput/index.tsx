import React, { KeyboardEvent } from "react";

type SearchInputProps = {
  searchTerm: string;
  onSearch: () => void;
  onClear: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


export const SearchInput = ({ searchTerm, onSearch, onClear, onChange }: SearchInputProps) => {  
  const onKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-full">
        <input
          className="border rounded p-2 w-full pr-10"
          placeholder="Search"
          value={searchTerm}
          onChange={onChange}
          onKeyDown={onKeyDownSearch}
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-gray-500 hover:text-gray-800"
          >
            X
          </button>
        )}
      </div>
      <button
        onClick={onSearch}
        className="text-white px-4 py-2 rounded"
        style={{ backgroundColor: "#1d4339" }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchInput;
