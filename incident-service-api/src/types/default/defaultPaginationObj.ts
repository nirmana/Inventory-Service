import { PaginationRequest } from "../request/paginationRequest";

export const defaultPaginationObj: PaginationRequest = {
  page: 1,
  pageSize: 10,
  sortOrder: "asc",
  sortKey: "_id",
  searchQueries: [],
};
