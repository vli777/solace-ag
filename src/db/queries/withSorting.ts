import { SortModel } from "@/types/query";
import { AnyColumn, asc, desc } from "drizzle-orm";
import { PgSelectDynamic } from "drizzle-orm/pg-core";

export function withSorting<T extends PgSelectDynamic<any>>(
  qb: PgSelectDynamic<any>,
  table: T,
  sortModel: SortModel,
): PgSelectDynamic<any> {
  const sortConditions = sortModel.map(({ colId, sort }) => {
    const column = table[colId as keyof T] as unknown as AnyColumn;
    return column ? (sort === "asc" ? asc(column) : desc(column)) : null;
  });

  return sortConditions.length > 0 ? qb.orderBy(...sortConditions.filter(x => x)) : qb;
}
