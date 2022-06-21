export interface Pagination {
  page: number;
  pageSize: number;
  sortOrder: string;
  sortKey: string
  searchQueries: any[] ;
}

export interface PaginationData<T> {
  totalRecords: number;
  data: T[];
  pagination: Pagination;
}
