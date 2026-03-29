import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, '../db', 'maindb.db');
const db = new Database(dbPath);


// ================TYPE====================
type functionHanldeWithDBType<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

type timeTableType = {
    time_id?: number;
    year?: number;
    month?: number;
}

type getAndSaveProps = {
    year: number;
    month: number;
}

type getType = {
    time_id: number;
}

type deleteTimeType = {
    row_id: number | bigint;
}

type saveTimeType = {
    row_id: number | bigint;
}

// ==================MAIN====================
// テーブル作成
db.exec(`
    CREATE TABLE IF NOT EXISTS times(
        time_id INTEGER NOT NULL,
        year INTEGER,
        month INTEGER,
        PRIMARY KEY(time_id)
    )
`);


/**
 * timesDBからデータを全て取得
 * @param mod           モード（0: defalut, 1: 任意条件変更）
 * @param colname       取得した列
 * @param sub           条件の対象     
 * @param condition     条件
 * @returns functionHanldeWithDBType
 */
export function getAll(mod: number, colname?: string, sub?: string, condition?: string): functionHanldeWithDBType<timeTableType[]>
{
    let query: string = "SELECT * FROM times ORDER BY month ASC";

    if (mod === 1) {
        if (!colname || colname === "" || !sub || sub === "" || !condition || condition === "") {
            return {
                success: false,
                mess: "if mod = 1, input colnam, sub, condition"
            }
        }
        query = `SELECT ${colname} FROM times WHERE ${sub} = ${condition} ORDER BY month ASC`;
    } 
    try {
        const result = db.prepare(`${query}`).all() as timeTableType[];
        return {
            success: true,
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
        // 知らないエラー
        return {
            success: false,
            mess: "Unknow error"
        };
    }   
}

/**
 * 該当するデータを取得
 * @param year  年
 * @param month 月
 * @returns functionHanldeWithDBType　
 */
export function getData(year: number, month: number): functionHanldeWithDBType<getType>
{
    try {
        const result = db.prepare(`SELECT time_id FROM times WHERE year = ? and month = ?`).get(year, month) as getType;
        if (!result) {
            return {
                success: false,
                mess: `There is not data named `
            };
        }
        return {
            success: true,
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
        // 知らないエラー
        return {
            success: false,
            mess: "Unknow error"
        };

    }
}

/**
 * 保存処理
 * @param data saveDataProps
 * @returns 
 */
export function saveData(data: getAndSaveProps): functionHanldeWithDBType<saveTimeType>
{

    try {
        const result = db.prepare(`INSERT INTO times(year, month) VALUES(?, ?)`).run(data.year, data.month);
        return {
            success: true,
            data: {row_id: result.lastInsertRowid},
            mess: `save data ok year: ${data.year}, month: ${data.month}`
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }
        // 知らないエラー
        return {
            success: false,
            mess: "Unknow error"
        };
    }
}

/**
 * 削除処理
 * @param timeId 
 * @returns 
 */
export function deleteData(time_ids: number[]): functionHanldeWithDBType<deleteTimeType>
{
    try {
        const placeholders = time_ids.map(() => "?").join(",");
        const result = db.prepare(`DELETE FROM times WHERE time_id IN (${placeholders})`).run(time_ids);
        return {
            success: true,
            data: {row_id: result.lastInsertRowid},
            mess: "delete time_id ok"
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }
        // 知らないエラー
        return {
            success: false,
            mess: "Unknow error"
        };
    }
}