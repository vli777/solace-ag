import { ilike, eq, and, SQL, AnyColumn, sql } from "drizzle-orm";
import { PgJsonb, PgSelectDynamic, PgTable } from "drizzle-orm/pg-core";

const textTypes = ["text", "varchar", "char"]

export function withFiltering<T extends PgTable<any>>(
  qb: PgSelectDynamic<any>,
  table: T,
  filterModel: Record<string, { type: string; filter: string }> = {}
): PgSelectDynamic<any> {
  const filters: SQL[] = Object.keys(filterModel).reduce((accFilters, filterKey) => {
    const { type, filter } = filterModel[filterKey];
    if (!filter) return accFilters;

    const tableColumn = table[filterKey as keyof T] as unknown as AnyColumn;
    if (!tableColumn) return accFilters;
    console.log({tableColumn})
    // filter non-text to prevent sql operation err
    const isJsonb = tableColumn instanceof PgJsonb 
    const isTextCompatible = textTypes.includes(tableColumn.dataType);
    if (!isJsonb && !isTextCompatible) {
      return accFilters
    }
    const column: any = isJsonb ? sql`${tableColumn}::text` : tableColumn;

    switch (type) {
      case "equals":
        accFilters.push(eq(column, filter));
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
    }

    return accFilters;
  }, [] as SQL[]);

  return filters.length > 0 ? qb.where(and(...filters)) : qb;
}
