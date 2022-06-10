import { IDBDriver } from "./bd-driver";
import { IORM } from "./orm";

function getOrError(property: any, propertyName: string) {
  if (property === undefined) {
    throw new Error(`${propertyName} is not defined!`);
  }

  return property;
}

type T = MyDI["dbDriver"];

let t: T;

interface IMyDI {
  dbDriver: IDBDriver;
  orm: IORM;
}

class MyDI implements IMyDI {
  registration<T extends IMyDI, K extends Exclude<keyof T, "registration">>(
    key: K,
    value: T[K]
  ) {
    if (this[`_${key}`] !== undefined) {
      throw new Error(`Свойство ${key} уже определено`);
    }

    this[`_${key}`] = value;
  }

  private _dbDriver?: IDBDriver;
  get dbDriver() {
    return getOrError(this._dbDriver, "dbDriver");
  }

  private _orm?: IORM;
  get orm() {
    return getOrError(this._orm, "orm");
  }
}

export const di = new MyDI();
