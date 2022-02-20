export interface ApiResponseDto<T> {
  data: T | null;
  status: number;
  message: string;
}
