import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, '../db', 'maindb.db');
const db = new Database(dbPath);


type functionHanldeWithDBType<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

type categoryTableType = {
    category_id: number,
    category_name: string,
    year?: number,
    month?: number,
}

type insetCategoryType = {
    row_id: number | bigint;
}

type saveCategoryType = {
    name: string,
    year: number,
    month: number
}

type updateCategoryType = {
    change_num: number;
}

// ==================MAIN====================
db.exec(`
    
    CREATE TABLE IF NOT EXISTS categories(
        category_id INTEGER NOT NULL,
        category_name VARCHAR(50),
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        PRIMARY KEY(category_id)   
    )
`);

/**
 * カテゴリ情報を保存する
 * @param data 
 * @returns 
 */
export function saveData(data: saveCategoryType): functionHanldeWithDBType<insetCategoryType>
{
    try {
        const result = db.prepare(`
            INSERT INTO categories(category_name, year, month) VALUES(?, ?, ?)
        `).run(data.name, data.year, data.month);
        return {
            success: result.lastInsertRowid !== 0,
            data: {row_id: result.lastInsertRowid},
            mess: ``
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: "Unknow Error"
        }
    }
}

/**
 * 
 * @param mod   0: 全部取得, 1: idとnameのみ取得、また条件を加える（year, month）
 * @param year 
 * @param month 
 * @returns 
 */
export function getAll(mod: number = 0, year: number = 0, month: number = 0): functionHanldeWithDBType<categoryTableType[]>
{
    try {
        let query: string = "SELECT * FROM categories";
        if (mod === 1) {
            query = `SELECT category_id, category_name FROM categories 
            WHERE year = ${year} AND month = ${month}`;
        }
        const result = db.prepare(query).all() as categoryTableType[]; 
        
        return {
            success: result.length > 0,
            data: result,
            mess: ""
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: ""
        };
    }
}

/**
 * 指定したカテゴリIDの情報を削除する処理
 * @param category_ids   カテゴリID
 * @returns successs    処理結果 true | false
 * @returns row_id      処理したID 
 * @returns mess        メッセージ 
 */
export function deleteData(category_ids: number[]): functionHanldeWithDBType<updateCategoryType>
{
    try {
        const placeholders = category_ids.map(() => "?").join(",");
        const result = db.prepare(`DELETE FROM categories WHERE category_id IN (${placeholders})`).run(category_ids); 
        return {
            success: result.changes !== 0,
            data: {change_num: result.changes},
            mess: ""
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: ""
        };
    }
}

/**
 * 更新処理
 * @param data 
 * @returns 
 */
export function updateData(category_id: number, category_name: string): functionHanldeWithDBType<updateCategoryType>
{
    try {
        const result = db.prepare(`UPDATE categories SET category_name = ? WHERE category_id = ?`).run(category_name, category_id); 
        return {
            success: result.changes !== 0,
            data: {change_num: result.changes},
            mess: ""
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: ""
        };
    }
}
