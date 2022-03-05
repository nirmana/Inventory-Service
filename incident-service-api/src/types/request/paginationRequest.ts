import { IsOptional } from "class-validator";

export class PaginationRequest {
  @IsOptional()
  page: number;
  @IsOptional()
  pageSize: number;
  @IsOptional()
  sortOrder: string;
  @IsOptional()
  sortKey: string;
  @IsOptional()
  searchQueries: { searchKey: string; searchPhrase: string }[];

  constructor(
    page: number,
    pageSize: number,
    sortOrder: string,
    sortKey: string,
    searchQueries: { searchKey: string; searchPhrase: string }[]
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.sortOrder = sortOrder;
    this.sortKey = sortKey;
    this.searchQueries = searchQueries;
  }
}
