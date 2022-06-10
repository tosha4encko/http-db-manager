import {
  buildAddColumnSQL,
  buildAddCommentSQL,
  buildAddIdSQL,
  buildCreateTableSQL,
  buildDeleteColumnSQL,
  buildDeleteTableSQL,
  Query,
} from "./build-sql";

import { di } from "di";
import { IColumnsORM, IQuery, IRowORM, ITableORM } from "./orm-types";
import { Column, Table } from "./data-types";
const { runSync, atomic } = di.dbDriver;

export const tablesORM: ITableORM = {
  createTable(table) {
    return atomic(() => {
      runSync(buildCreateTableSQL(table));
      runSync(buildAddCommentSQL(table, table.display));
      runSync(buildAddIdSQL(table));

      return { ...table };
    });
  },
  deleteTable(table) {
    runSync(buildDeleteTableSQL(table));
  },
  getTables(query) {
    return runSync(query.build("table")) as Table[];
  },
} as const;

export const columnsORM: IColumnsORM = {
  createColumn(column: Column) {
    runSync(buildAddColumnSQL(column));
    return { ...column, table: { ...column.table } };
  },
  deleteColumn(column: Column) {
    runSync(buildDeleteColumnSQL(column));
  },
  getColumns(table: Table, query: IQuery) {
    return runSync(query.build("columns", table));
  },
};

di.registration("orm", {
  columnsORM,
  tablesORM,
  rowORM: {} as IRowORM,
  query: (table) => new Query(table),
});
