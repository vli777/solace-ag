"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import AgGridTable from "./AgGridTable/AgGridTable";
import { advocatesColumnDefs } from "./columnDefs";
import { FilterModel } from "@/types/query";

const advocatesColumns: string[] = advocatesColumnDefs.map((col) => col.field)

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModel, setFilterModel] = useState<FilterModel>({});

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  }

  const handleSearch = () => {    
    if (searchTerm.trim()) {
      const searchAllModel: FilterModel = advocatesColumns.reduce(
        (acc, columnName) => {
          acc[columnName] = {
            type: "contains",
            filter: searchTerm.trim(),
          };
          return acc;
        },
        {} as FilterModel
      );

      setFilterModel(searchAllModel);
    }
  };

  const onKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilterModel({}); 
  };

  useEffect(() => {
    if (!searchTerm.length) {
      handleClearSearch();
    }
  }, [searchTerm])

  return (
    <main className="m-6 space-y-6">
      <h1 className="text-2xl font-bold">Solace Advocates</h1>
      <div className="space-y-2">
        <div className="flex items-center gap-2 w-128">
          <div className="relative w-full">
            <input
              className="border rounded p-2 w-full pr-10"
              placeholder="Searching for"
              value={searchTerm}
              onChange={onChangeSearch}
              onKeyDown={onKeyDownSearch}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-gray-500 hover:text-gray-800"
              >
                X
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="flex-1 h-[900px]">
        <AgGridTable
          url="/api/advocates"
          columnDefs={advocatesColumnDefs}
          filterModel={filterModel}
        />
      </div>
    </main>
  );
}
