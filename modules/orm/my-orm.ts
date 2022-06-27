import {
  buildAddColumnSQL,
  buildAddCommentSQL,
  buildAddIdSQL,
  buildCreateTableSQL,
  buildDeleteColumnSQL,
  buildDeleteTableSQL,
} from "./build-sql";

import { di } from "di";
import { IColumnsORM, IQuery, IRowORM, ITableORM } from "./orm-types";
import { Column, Table } from "./data-types";
import { Query } from "./query";

const { runSync, atomic } = di.dbDriver;

export class TablesORM implements ITableORM {
  createTable(table) {
    return atomic(() => {
      runSync(buildCreateTableSQL(table));
      runSync(buildAddCommentSQL(table, table.display));
      runSync(buildAddIdSQL(table));

      return { ...table };
    });
  }
  deleteTable(table) {
    runSync(buildDeleteTableSQL(table));
  }
  getTables(query) {
    return query.run("table") as Table[];
  }
}

export class ColumnsORM implements IColumnsORM {
  createColumn(column: Column) {
    runSync(buildAddColumnSQL(column));
    return { ...column, table: { ...column.table } };
  }
  deleteColumn(column: Column) {
    runSync(buildDeleteColumnSQL(column));
  }
  getColumns(table: Table, query: IQuery) {
    return runSync(query.run("columns", table));
  }
}

di.registration("orm", {
  columnsORM: () => new ColumnsORM(),
  tablesORM: () => new TablesORM(),
  rowORM: {} as IRowORM,
  query: (args) => new Query(...args),
});
