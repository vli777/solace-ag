import { FilterModel } from "@/types/query";
import { SortModelItem } from "ag-grid-community"
import { eq, ilike, and, asc, desc, Column } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core";

/**
 * buildQuery is a utility function to construct sql queries with filters and sorting for use with Drizzle ORM
 * @param query: base query object
 * @param table: db table schema 
 * @param filterModel: AG Grid FilterModel containing filter params
 * @param sortModel: AG Grid SortModelItem[] containing target column and sort type 'asc' vs 'desc'
 * 
 * @returns final query object with sorts and filters applied 
 */
export default function buildQuery<T extends PgTable>(
    query: any, 
    table: T,
    filterModel: FilterModel = {}, 
    sortModel: SortModelItem[] = [],
    options: { limit?: number; offset?: number } = {}
) {
    const queryFilters = Object.keys(filterModel).reduce((accFilters, filterKey) => {
        const { type, filter } = filterModel[filterKey];
        
        const column = table[filterKey as keyof T] as Column | undefined;
        if (!column) return accFilters;
                    
        switch(type) {
            case "equals":
                return [...accFilters, eq(column, filter)]
            case "contains":
                return [...accFilters, ilike(column, `%${filter}%`)]               
            case "startsWith":
                return [...accFilters, ilike(column, `${filter}%`)]
            case "endsWith":
                return [...accFilters, ilike(column, `%${filter}`)]
            default:
                return accFilters
        }
    }, [] as ReturnType<typeof and>[])        

    if (queryFilters.length > 0) {
        query = query.where(and(...queryFilters))
    }

    if (sortModel?.length > 0) {
        const sortConditions = sortModel.map(({ colId, sort }) => {
            const column = table[colId as keyof T] as Column | undefined;
            if (column) {
                return sort === "asc" ? asc(column) : desc(column)
            }
            return null;
        });

        if (sortConditions.length > 0) {
            query = query.orderBy(...sortConditions)
        }
    }

    const { limit, offset } = options
    if (limit) {
        query = query.limit(limit)
    }
    if (offset) {
        query = query.offset(offset)
    }

    return query
}