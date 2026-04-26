import { AppTable } from "./AppTable";

import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, '../db', 'maindb.db');
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS years(
        year_id INTEGER PRIMARY KEY,
        year_name INTEGER NOT NULL UNIQUE
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS categories(
        category_id INTEGER PRIMARY KEY,
        category_name VARCHAR(50) NOT NULL,
        category_type INTEGER NOT NULL,
        display INTEGER NOT NULL,
        priority INTEGER NOT NULL,
        note TEXT,
        time_id INTEGER NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS times(
        time_id INTEGER PRIMARY KEY,
        year_id INTEGER NOT NULL,
        month INTEGER NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS expenses(
        expense_id INTEGER PRIMARY KEY,
        day INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        money INTEGER NOT NULL,
        note TEXT,
        time_id INTEGER NOT NULL
    )        
`);


export class Table extends AppTable
{

}