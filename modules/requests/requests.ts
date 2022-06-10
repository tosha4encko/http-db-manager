import { IQuery } from "../orm";
import { Request } from "express";
import { Query } from "../orm/query";
import { di } from "di";
import { Filter } from "./filters";

const express = require("express");
const app = express();

export type methodView = (requset: Request) => Response;
export type Middlevares = (request: Request) => void;
export enum Methods {
  "post" = "post",
  "get" = "get",
  "put" = "put",
  "delete" = "delete",
}

interface IView {
  _urlPattern: string;
  _filters: Filter[];
}

interface Response {
  status: number;
  message?: string;
  body?: object;
}

export class RequestContext {
  constructor(readonly urlPattern: string, readonly filters: Filter[] = []) {}

  registration(
    method: Methods,
    handler: (request: Request) => {
      status: number;
      message?: string;
      body?: object;
    }
  ) {
    app[method](this.urlPattern, (req, res) => {
      const { status, message, body } = handler(req);
      res.statusCode(status).statusMessage(message).send(handler(req));
    });
  }

  applyFilters(request: Request, query: IQuery) {
    this.filters.forEach((filter) => filter(request, query));
  }
}
