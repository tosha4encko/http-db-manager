import { IQuery, Term } from "./orm-types";
import { Column, Table } from "./data-types";

import { di } from "di";
const { fromColumnsSQL, fromTablesSQL } = di.dbDriver;

export class Query implements IQuery {
  // todo агрегация
  constructor(
    private _table?: Table,
    private _terms: Term[] = [],
    private _order?: ["DESC" | "ASC", Column],
    private _page?: number,
    private _pageSize?: number
  ) {}

  set page(value: number) {
    this._page = value;
  }

  set pageSize(value: number) {
    this._pageSize = value;
  }

  set order(value: ["DESC" | "ASC", Column]) {
    const { scheme, name } = value[1].table;
    if (scheme === this._table.scheme && name === this._table.name) {
      this._order = value;
    }

    throw new Error("bad column");
  }

  get terms() {
    return [...this._terms];
  }

  addTerm(term: Term | null) {
    if (term === null) {
      this._terms = [];
    } else {
      const { scheme, name } = term[0].table;
      if (scheme === this._table.scheme && name === this._table.name) {
        this._terms.push([...term]);
      }
    }
  }

  run(intent: "table" | "columns" | "data") {
    let from: string;
    if (intent === "data") {
      from = `FROM ${this._table.scheme}.${this._table.name}`;
    }
    if (intent === "columns") {
      from = fromColumnsSQL(this._table);
    }
    if (intent === "table") {
      from = fromTablesSQL();
    }

    return di.dbDriver.runSync(`
      SELECT * ${from}
      WHERE ${this._terms.map((term) => term.join(" ")).join(" & ")}
      ORDER BY ${this._order[1]} ${this._order[0]} 
      LIMIT ${this._pageSize}
      OFFSET ${this._page * this._pageSize - this._pageSize}
    `);
  }

  len(intent: "table" | "columns" | "data") {
    let from: string;
    if (intent === "data") {
      from = `FROM ${this._table.scheme}.${this._table.name}`;
    }
    if (intent === "columns") {
      from = fromColumnsSQL(this._table);
    }
    if (intent === "table") {
      from = fromTablesSQL();
    }
    return di.dbDriver.runSync(`
      SELECT count(*) ${from}
      WHERE ${this._terms.map((term) => term.join(" ")).join(" & ")}
    `);
  }
}
