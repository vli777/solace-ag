import { generateAdvocates } from "@/db/seed/advocates";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function POST() {
  const advocateData = generateAdvocates(100)
  
  const records = await db.insert(advocates).values(advocateData).returning();

  return Response.json({ advocates: records });
}
