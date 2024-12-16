import { NextResponse } from "next/server";
import db from "@/db";
import { advocates } from "@/db/schema";
import buildQuery from "@/app/utils/buildQuery";
import { count } from "drizzle-orm";
import { buildAdvocatesQuery } from "./buildAdvocatesQuery";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { filterModel, sortModel, limit, offset } = body

    const query = buildAdvocatesQuery(filterModel, sortModel, { limit, offset })    
    const data = await query
    
    // get total count of rows for pagination usage
    // @ts-ignore
    const totalQuery = db.select({ total: count() }).from(advocates);
    const [{ total }] = await buildQuery(totalQuery, advocates, filterModel, [])

    return NextResponse.json({
      data,
      total
    })
  } catch (error) {
    const errorMessage = "Error fetching /api/advocates"
    console.error(errorMessage, error);

    return NextResponse.json({ status: 500, error: errorMessage })
  }
}