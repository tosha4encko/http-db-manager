export interface Table {
  // todo всегда ли есть схема?
  scheme: string;
  name: string;
  display?: string;
}

export interface Column {
  table: Table;
  name: string;
  type: ORMColumnType;
  display?: string;
  isNull?: boolean;
  isPK?: boolean;
}

export type Row = { id: KeyType };

export function isTable(arg: any): arg is Table {
  return typeof arg.name === "string" && typeof arg.scheme === "string";
}

export function isColumnType(arg: string): arg is ORMColumnType {
  return ORMColumnType[arg] !== undefined;
}

export function isColumn(arg: any): arg is Column {
  return (
    isTable(arg.table) && typeof arg.name === "string" && isColumnType(arg.type)
  );
}

export enum Operation {
  "equal" = "=",
  "!equal" = "!=",
  "less" = "<",
  "more" = ">",
  "in" = "i ",
}

// todo разобрать остальные типы
export enum ORMColumnType {
  "String" = "VarChar",
  "Text" = "text",
  "Integer" = "integer",
  "Float" = "float",
  "Date" = "date",
  "Boolean" = "boolean",
}
