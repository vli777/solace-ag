import { FilterModel, SortModel } from "@/types/query";

type FetchParams = {
  url: string;
  sortModel?: SortModel;
  filterModel?: FilterModel;
  offset?: number;
  limit?: number;
};

type FetchResponse<T> = {
  data: T[];
  nextCursor?: number | null;
};

export async function fetchData<T>({
  url,
  sortModel = [],
  filterModel = {},
  offset,
  limit = 50,
}: FetchParams): Promise<FetchResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sortModel,
        filterModel,
        offset,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }

    const result: FetchResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}
