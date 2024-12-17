import React, { useRef, useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { IGetRowsParams, ColDef } from "ag-grid-community";
import { fetchData } from "../utils/fetchData";
import { FilterModel, SortModel } from "@/types/query";

type AgGridTableProps = {
  url: string;
  columnDefs: ColDef[];
  filterModel?: FilterModel;
};

const AgGridTable = ({ url, columnDefs, filterModel }: AgGridTableProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [cacheBlockSize, setCacheBlockSize] = useState(50);

   useEffect(() => {
    const calculateCacheBlockSize = () => {
      const rowHeight = 25; // AG Grid default row height
      const viewportHeight = window.innerHeight;

      const headerHeight = headerRef.current?.offsetHeight || 0;
      const usableHeight = viewportHeight - headerHeight;

      const rows = Math.floor(usableHeight / rowHeight);
      setCacheBlockSize(rows);
    };

    calculateCacheBlockSize();
    window.addEventListener("resize", calculateCacheBlockSize);

    return () => window.removeEventListener("resize", calculateCacheBlockSize);
  }, []);

  const data = useMemo(() => ({
    getRows: async (params: IGetRowsParams) => {
      const { startRow, endRow, sortModel } = params;

      try {
        const offset = startRow;
        const limit = endRow - startRow;

        const response = await fetchData<any>({
          url,
          sortModel: sortModel as SortModel,
          filterModel: filterModel as FilterModel,
          offset,
          limit,
        });

        const rows = response.data || [];
        const lastRow = response.nextCursor ? undefined : startRow + rows.length;

        params.successCallback(rows, lastRow);
      } catch (error) {
        console.error("Error fetching rows:", error);
        params.failCallback();
      }
    },
  }), [url, filterModel]);

  const onGridReady = () => {
    gridRef.current?.api?.setGridOption("datasource", data);
  };

  return (
    <div className="ag-theme-alpine h-full w-full">
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowModelType="infinite"
        cacheBlockSize={cacheBlockSize} 
        onGridReady={onGridReady}
        pagination={false}
      />
    </div>
  );
};

export default AgGridTable;
