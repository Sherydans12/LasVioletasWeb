export const DEFAULT_PAGE_LIMIT = 12;
export const MAX_PAGE_LIMIT = 48;

export type PaginationParams = {
  page: number;
  limit: number;
  skip: number;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export function parsePaginationParams(
  searchParams?: { page?: string; limit?: string },
  defaultLimit = DEFAULT_PAGE_LIMIT
): PaginationParams {
  const page = Math.max(1, Number.parseInt(searchParams?.page ?? "1", 10) || 1);
  const parsedLimit =
    Number.parseInt(searchParams?.limit ?? String(defaultLimit), 10) || defaultLimit;
  const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parsedLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}
