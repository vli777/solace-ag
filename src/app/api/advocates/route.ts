import { NextResponse } from "next/server";
import db from "@/db";
import { advocates } from "@/db/schema";
import buildQuery from "@/app/utils/buildQuery";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filterModel, sortModel, offset, limit = 10 } = body;

    let query = db.select().from(advocates);
    query = buildQuery(query, advocates, filterModel, sortModel, { offset, limit });

    const data = await query;
    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    return NextResponse.json({ data, nextCursor });
  } catch (error) {
    const errorMessage = "Error fetching /api/advocates";
    console.error(errorMessage, error);

    return NextResponse.json({ status: 500, error: errorMessage });
  }
}
