import { FilterModel, SortModel } from "@/types/query";
import { eq, ilike, and, asc, desc, gt, SQL } from "drizzle-orm"
import { PgColumn, PgTable } from "drizzle-orm/pg-core";

/**
 * buildQuery is a utility function to construct sql queries with filters and sorting for use with Drizzle ORM
 * @param query: base query object
 * @param table: db table schema 
 * @param filterModel: AG Grid FilterModel containing filter params
 * @param sortModel: AG Grid SortModelItem[] containing target column and sort type 'asc' vs 'desc'
 * @param limit: number of rows to return in query
 * @param offset: number for cursor offset (primary key id) where to start the query  
 * 
 * @returns final query object with sorts, filters, and pagination applied 
 */
export default function buildQuery<T extends PgTable<any>> (
    query: any, 
    table: T,
    filterModel: FilterModel = {}, 
    sortModel: SortModel = [],
    limit?: number,
    offset?: number,
) {
    const queryFilters = Object.keys(filterModel).reduce((accFilters, filterKey) => {
        const { type, filter } = filterModel[filterKey];
        
        const column = table[filterKey as keyof T] as PgColumn | undefined;
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
    }, [] as SQL[])        

    if (queryFilters.length > 0) {
        query = query.where(and(...queryFilters))
    }

    if (sortModel?.length > 0) {
        const sortConditions = sortModel.map(({ colId, sort }) => {
            const column = table[colId as keyof T] as PgColumn | undefined;
            return column 
                ? sort === "asc" 
                    ? asc(column) 
                    : desc(column)
                : null
        }).filter(Boolean)

        if (sortConditions.length > 0) {
            query = query.orderBy(...sortConditions)
        }
    }

    if (offset) {
        const idColumn = (table as unknown as { id: PgColumn }).id;
        query = query.where(gt(idColumn, offset));
    }
    if (limit) {
        query = query.limit(limit);
    }

    return query
}