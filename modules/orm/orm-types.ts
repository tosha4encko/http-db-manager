import { Column, Operation, Row, Table } from "./data-types";

export interface IORM {
  tablesORM: () => ITableORM;
  columnsORM: () => IColumnsORM;
  rowORM: () => IRowORM;
  query: () => IQuery;
}

export interface IColumnsORM {
  readonly createColumn: (column: Column) => Column;
  readonly deleteColumn: (column: Column) => void;
  readonly getColumns: (table: Table, query: IQuery) => Column[];
}

export interface ITableORM {
  createTable(table: Table): Table;
  deleteTable(table: Table): void;
  getTables(query: IQuery): Table[];
}

export interface IRowORM {
  select(table: Table, query: IQuery): Row[];
  insert(table: Table, row: Row): Row;
  delete(table: Table, row: Row): Row;
  update(table: Table, row: Row): Row;
}

export type Term = [Column, Operation, string];

export interface IQuery {
  order?: ["DESC" | "ASC", Column];
  page?: number;
  pageSize?: number;
  terms: Term[];
  addTerm(term: Term | null): void;

  run(intent: "table"): Table[];
  run(intent: "columns", table: Table): Column[];
  run(intetn: "data", table: Table): object[];

  len(intent: "table"): number;
  len(intent: "columns", table: Table): number;
  len(intetn: "data", table: Table): number;
}
