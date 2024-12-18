import React, { useRef, useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { IGetRowsParams, ColDef, InfiniteRowModelModule, ValidationModule, ModuleRegistry, ColumnAutoSizeModule } from "ag-grid-community";
import { fetchData } from "../../utils/fetchData";
import { FilterModel } from "@/types/query";

ModuleRegistry.registerModules([ InfiniteRowModelModule, ValidationModule, ColumnAutoSizeModule ]);

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

  const autoSizeColumns = () => {
    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", autoSizeColumns);
    return () => window.removeEventListener("resize", autoSizeColumns);
  }, []);

  const columns = useMemo(() => columnDefs.map((col) => ({ ...col, minWidth: 120 })), [columnDefs]);

  const data = useMemo(() => ({
    getRows: async (params: IGetRowsParams) => {
      const { startRow, endRow, sortModel } = params;

      try {
        const offset = startRow;
        const limit = endRow - startRow;

        const response = await fetchData<any>({
          url,
          sortModel,
          filterModel,
          offset,
          limit,
        });

        const rows = response.data || [];
        const lastRow = response.nextCursor === null ? startRow + rows.length : undefined;

        params.successCallback(rows, lastRow);
      } catch (error) {
        console.error("Error fetching rows:", error);
        params.failCallback();
      }
    },
  }), [url, filterModel]);

  return (
    <div className="ag-theme-quartz h-full w-full overflow-x-auto">
      <AgGridReact
        ref={gridRef}
        columnDefs={columns}
        rowModelType="infinite"
        cacheBlockSize={cacheBlockSize} 
        datasource={data}    
      />
    </div>
  );
};

export default AgGridTable;
