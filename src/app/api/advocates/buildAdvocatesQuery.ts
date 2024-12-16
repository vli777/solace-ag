import buildQuery from "@/app/utils/buildQuery";
import db from "@/db";
import { advocates } from "@/db/schema";
import { FilterModel, SortModel } from "@/types/query";

export function buildAdvocatesQuery(
    filterModel: FilterModel = {},
    sortModel: SortModel = [],
    options: { limit?: number; offset?: number } = {}
  ) {
    let query = db.select().from(advocates)
    query = buildQuery(query, advocates, filterModel, sortModel, options)
  
    return query;
  }