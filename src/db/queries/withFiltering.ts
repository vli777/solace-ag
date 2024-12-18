import { FilterModel } from "@/types/query";
import { ilike, eq, and, SQL, AnyColumn, sql, or } from "drizzle-orm";
import { PgSelectDynamic, PgTable } from "drizzle-orm/pg-core";

export function withFiltering<T extends PgTable<any>>(
  qb: PgSelectDynamic<any>,
  table: T,
  filterModel: FilterModel,
): PgSelectDynamic<any> {
  const filters: SQL[] = Object.keys(filterModel).reduce((accFilters, filterKey) => {
    const { type, filter } = filterModel[filterKey];
    if (!filter) return accFilters;

    const tableColumn = table[filterKey as keyof T] as unknown as AnyColumn;
    if (!tableColumn) return accFilters;

    // filter non-text to prevent sql operation err
    const isTextCompatible = ['json', 'string'].includes(tableColumn.dataType);
    if (!isTextCompatible) {  
      return accFilters;
    }

    const column: SQL = tableColumn.dataType === 'json'
      ? sql`${tableColumn}::text`
      : sql`${tableColumn}`; 

    switch (type) {
      case "equals":
        accFilters.push(eq(column, sql`${filter}`));
        break;
      case "contains":
        accFilters.push(ilike(column, `%${filter}%`));
        break;
      case "startsWith":
        accFilters.push(ilike(column, `${filter}%`));
        break;
      case "endsWith":
        accFilters.push(ilike(column, `%${filter}`));
        break;
      default:
        console.warn(`Unsupported filter type '${type}' for column '${filterKey}'.`);
        break;
    }

    return accFilters;
  }, [] as SQL[]);

  return filters.length > 0 ? qb.where(or(...filters)) : qb;
}
