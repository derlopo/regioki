export interface Payload<T> {
  find(
    arg0: (board: {
      BI_DatabaseOperationsID: number;
      outOfScope: any;
    }) => boolean
  ): unknown;
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
