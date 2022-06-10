import { IQuery } from "../orm";
import { Request } from "express";
import { Query } from "../orm/query";
import { di } from "di";
import { Methods, RequestContext } from "./requests";
import { PaginationFilter } from "./filters";

const express = require("express");
const app = express();

const TableRequestContext = new RequestContext("tables", [PaginationFilter]);

TableRequestContext.registration(Methods.get, (request) => {
  const query = new Query();
  TableRequestContext.applyFilters(request, query);

  return {
    status: 200,
    message: di.dbDriver.run(query.build("table")),
  };
});

TableRequestContext.registration(Methods.post, (request) => {
  const { name, display } = request.params;
  if (name === undefined) {
    return {
      status: 400,
      message: "table-name no defined",
    };
  }

  return {
    status: 201,
    data: di.orm.createTable({ name, display }),
  };
});
