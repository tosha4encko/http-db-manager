import { di } from "../di";
import { Column, ORMColumnType, Table } from "./data-types";

export function quoteColumn(column: Column) {
  const { table, name, display, type, ...rest } = column;

  const quotedTable = quoteTable(table);
  const quotedName = di.dbDriver.quoteName(name);
  const quotedDisplay = display ? di.dbDriver.quoteName(display) : undefined;
  const quotedType = ORMColumnType[type];

  return {
    table: quotedTable,
    name: quotedName,
    display: quotedDisplay,
    type: quotedType,
    ...rest,
  };
}

export function quoteTable(table: Table): Table {
  const { name, display, scheme } = table;
  const quoteScheme = di.dbDriver.quoteName(scheme);
  const quoteTableName = di.dbDriver.quoteName(name);
  const quoteDisplay = display ? di.dbDriver.quoteName(display) : undefined;

  return { scheme: quoteScheme, name: quoteTableName, display: quoteDisplay };
}
