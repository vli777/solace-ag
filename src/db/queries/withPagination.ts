import { PgSelect } from "drizzle-orm/pg-core";

export function withPagination<T extends PgSelect>(
    qb: T,
    offset: number = 0,
    limit: number = 50
  ) {
    return qb.limit(limit).offset(offset);
  }
  