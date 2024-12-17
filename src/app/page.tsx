"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import AgGridTable from "./AgGridTable/AgGridTable";
import { advocatesColumnDefs } from "./columnDefs";
import { FilterModel } from "@/types/query";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModel, setFilterModel] = useState<FilterModel>({});

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  }

  const handleSearch = () => {    
    if (searchTerm.trim()) {
      setFilterModel({
        name: {
          type: "contains",
          filter: searchTerm.trim(),
        },
      });
    }
  };

  const onKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="m-6 space-y-6">
      <h1 className="text-2xl font-bold">Solace Advocates</h1>
      <div className="space-y-2">
        <p className="font-medium">Search</p>
        <div className="flex items-center gap-2">
          <input
            className="border border-black p-2 w-64"
            placeholder="Searching for"
            value={searchTerm}
            onChange={onChangeSearch}
            onKeyDown={onKeyDownSearch}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex-1 h-[500px]">
        <AgGridTable
          url="/api/advocates"
          columnDefs={advocatesColumnDefs}
          filterModel={filterModel}
        />
      </div>
    </main>
  );
}
