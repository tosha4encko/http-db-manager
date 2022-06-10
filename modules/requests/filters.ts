import { Request } from "express";
import { IQuery } from "../orm";

export type Filter = (request: Request, query: IQuery) => IQuery;

export function PaginationFilter(request: Request, query: IQuery): IQuery {
  const page = Number(request.params._page);
  const pageSize = Number(request.params["_page-size"]);

  if (!Number.isNaN(page) && !Number.isNaN(pageSize)) {
    query.page = Number(page);
    query.pageSize = Number(pageSize);
  }

  return query;
}
