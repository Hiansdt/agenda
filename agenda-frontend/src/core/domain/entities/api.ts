export interface IPagination {
  page: number;
  pageSize: number;
  total: number;
  numPages: number;
}

export interface IPaginatedResponse<T> extends IPagination {
  items: T[];
}
