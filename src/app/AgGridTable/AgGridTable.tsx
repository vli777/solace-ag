import React, { useEffect, useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { fetchData } from "../utils/fetchData";
import { FilterModel, SortModel } from "@/types/query";

type AgGridTableProps = {
  url: string;
  columnDefs: any[];
  filterModel?: FilterModel;
  limit?: number; 
  pagination?: boolean;
};

const AgGridTable = ({
  url,
  columnDefs,
  filterModel = {},
  limit = 10,
  pagination = true,
}: AgGridTableProps) => {
  const gridRef = useRef<any>(null)
  const [rowData, setRowData] = useState<any[]>([])

  const loadTableData = useCallback(
    async (sortModel: SortModel = [], offset?: number) => {
      try {
        const response = await fetchData({
          url,
          sortModel,
          filterModel,
          offset,
          limit,
        });

        setRowData(response.data)
      } catch (error) {
        console.error("Error loading table data:", error)
      }
    },
    [url, filterModel, limit]
  );

  const onSortChanged = useCallback(() => {
    const sortModel = gridRef.current.api.getSortModel();
    loadTableData(sortModel);
  }, [loadTableData]);

  useEffect(() => {
    loadTableData();
  }, [loadTableData]);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        onSortChanged={onSortChanged}
        pagination={pagination}
        paginationPageSize={limit}
      />
    </div>
  );
};

export default AgGridTable
