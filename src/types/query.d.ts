import { SortModelItem } from "ag-grid-community"

export type FilterModel = Record<
    string, 
    { 
        type: "equals" | "contains" | "startsWith" | "endsWith"
        filter: any 
    }>

export type SortModel = SortModelItem[]