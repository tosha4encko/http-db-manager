import { Column, isColumn, ORMColumnType, Table, IQuery, Term } from "./types";
import { quoteColumn, quoteTable } from "./quote";

import { di } from "di";
const { fromColumnsSQL, fromTablesSQL } = di.dbDriver;

export interface IBuildSQL {
  buildCreateTableSQL(table: Table): string;
  buildDeleteTableSQL(table: Table): string;
  buildAddColumnSQL(column: Column): string;
  buildDeleteColumnSQL(column: Column): string;
  buildAddCommentSQL(current: Table, comment: string);
  buildAddCommentSQL(current: Column, comment: string);
}

export interface IBuildRowSQL {}
export function buildCreateTableSQL(table: Table) {
  const { scheme, name } = quoteTable(table);
  return `CREATE TABLE ${scheme}.${name} ();`;
}

export function buildDeleteTableSQL(table: Table) {
  const { scheme, name } = quoteTable(table);
  return `DELETE TABLE ${scheme}.${name};`;
}

export function buildAddCommentSQL(current: Table, comment: string);
export function buildAddCommentSQL(current: Column, comment: string);
export function buildAddCommentSQL(current: Table | Column, comment: string) {
  if (isColumn(current)) {
    const { table, name } = quoteColumn(current);
    return `ADD COMMENT ${table.scheme}.${table.name}.${name} ${comment};`;
  }

  const { scheme, name } = quoteTable(current);
  return `ADD COMMENT ${scheme}.${name} ${comment};`;
}

// todo индекс
// todo reference
export function buildAddColumnSQL(column: Column) {
  const { table, name, type, isNull, isPK } = quoteColumn(column);

  return `
        ALERT TABLE ${table.scheme}.${table.name}
        ADD COLUMN ${name} ${type} 
            ${isPK ? "PRIMARY KEY" : ""}
            ${isNull ? "" : "not null"};
    `;
}

export function buildDeleteColumnSQL(column: Column) {
  const { table, name, type, isNull, isPK } = quoteColumn(column);

  return `
        ALERT TABLE ${table.scheme}.${table.name}
        DELETE COLUMN ${name} ${type} 
            ${isPK ? "PRIMARY KEY" : ""}
            ${isNull ? "" : "not null"};
    `;
}

export function buildAddIdSQL(table: Table) {
  return buildAddColumnSQL({
    table,
    name: "id",
    type: ORMColumnType.Integer,
    isPK: true,
  });
}

export function buildGetColumnSQL(table: Table) {
  const { scheme, name } = quoteTable(table);
  return `PRAGMA ${scheme}.table_list(${name})`;
}

export function buildGetTablesSQL() {
  return "SELECT name FROM sqlite_master WHERE type='table';";
}

export interface IBuildSQL {}
