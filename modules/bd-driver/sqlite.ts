import { IDBDriver } from "./types";
import { di } from "di";

export const SQLiteDriver: IDBDriver = {
  run(sql: string) {
    return new Promise();
  },
  atomic(callback: () => void) {
    try {
      return callback();
    } catch (err) {
      // todo revert transaction
      throw err;
    }
  },
  quoteName(name: string): string {
    name = name.replace('"', '""');
    name = name.replace("'", "''");
    name = name.replace("`", "``");

    return `"${name}"`;
  },
};

di.registration("dbDriver", SQLiteDriver);
