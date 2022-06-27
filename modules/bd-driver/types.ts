import { Table } from "orm/data-types";

export interface IDBDriver {
  run(sql: string): Promise<any>;
  runSync(sql: string): any;
  atomic(callback: () => void);
  quoteName(name: string): string;
  fromColumnsSQL(table: Table): string;
  fromTablesSQL(): string;
}
