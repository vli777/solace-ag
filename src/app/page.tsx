"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { advocatesColumnDefs } from "./columnDefs";
import { FilterModel } from "@/types/query";
import { AgGridTable, SearchInput } from "./Components";
import { Logo } from "./Logo";

const advocatesColumns: string[] = advocatesColumnDefs.map((col) => col.field)

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModel, setFilterModel] = useState<FilterModel>({});

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
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
      <div className="flex items-center">
        <Logo />
        <span className="text-3xl font-bold"> Advocates</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 w-128">
          <SearchInput
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            onChange={handleChangeSearch}
          />
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
