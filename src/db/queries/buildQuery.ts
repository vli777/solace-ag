import { FilterModel, SortModel } from "@/types/query";
import { withFiltering } from "./withFiltering";
import { withSorting } from "./withSorting";
import { withPagination } from "./withPagination";
import { PgSelectDynamic, PgTable } from "drizzle-orm/pg-core";
import { advocates } from "../schema";

/**
 * buildQuery is a utility function to construct sql queries with filters and sorting for use with Drizzle ORM
 * @param query: base query object from drizzle pgSelect
 * @param filterModel: AG Grid FilterModel containing filter params
 * @param sortModel: AG Grid SortModelItem[] containing target column and sort type 'asc' vs 'desc'
 * @param offset: optional number from where row results should start
 * @param limit: optional limit of row results
 * 
 * @returns final query object with sorts and filters applied 
 */
export default function buildQuery<T extends PgTable<any>>(
    dynamicQuery: PgSelectDynamic<any>,
    table: T,
    filterModel: FilterModel = {},
    sortModel: SortModel = [],
    offset?: number,
    limit?: number,
) : PgSelectDynamic<any> {      
    dynamicQuery = withFiltering(dynamicQuery, table, filterModel);
    dynamicQuery = withSorting(dynamicQuery, table, sortModel);
    dynamicQuery = withPagination(dynamicQuery, offset, limit);    
  
    return dynamicQuery;    
}