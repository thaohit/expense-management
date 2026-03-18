import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, '../db', 'maindb.db');
const db = new Database(dbPath);

// ================TYPE====================

type yearTableType = {
    year_id: number;
    year_name: number;
}

type typeFunctionHanldeWithDB<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

type typeGetAllYear = {
    success: boolean;
    data: yearTableType[];
    mess: string;
}

type typeGetYear = {
    year_id: number;
}

type typeInsetYear = {
    row_id: number | bigint;
}


// ==================MAIN====================
db.exec(`
    CREATE TABLE IF NOT EXISTS year(
        year_id INTEGER NOT NULL,
        year_name INTEGER UNIQUE,
        PRIMARY KEY(year_id)
    )
`);

/**
 * year取得
 * @param year number
 * @returns 
 */
export function selectData(year: number): typeFunctionHanldeWithDB<typeGetYear>
{
    try {
        const result = db.prepare(`SELECT year_id FROM year WHERE year_name = ?`).get(year) as typeGetYear;
        if (!result) {
            return {
                success: false,
                mess: `There is not data name ${year}`
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
 * yearDBからデータを全て取得
 * @returns 
 */
export function getAll(): typeFunctionHanldeWithDB<yearTableType[]>
{
    try {
        const result = db.prepare(`SELECT * FROM year ORDER BY year_name ASC`).all() as yearTableType[];
        if (result.length < 0) {
            return {
                success: false,
                mess: "There is not datas"
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
 * yearの保存処理
 * @param year number
 * @returns 
 */
export function saveData(year: number): typeFunctionHanldeWithDB<typeInsetYear>
{
    try {
        const result = db.prepare(`INSERT INTO year(year_name) VALUES(?)`).run(year);
        return {
            success: true,
            data: {row_id: result.lastInsertRowid},
            mess: "Save OK "
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
 * 年削除
 * @param year_ids 選択年
 * @returns {
 * success 
 * data
 * mess
 * }
 */
export function deleteData(year_ids: number[]): typeFunctionHanldeWithDB<typeInsetYear>
{
    try {
        console.log("db delete year" , year_ids);
        // placeholderを作成する
        // ?の配列を作成し、そしてjoin()で,区切りの配列へ変換
        // vd ["1", "2", "3"] -> join() -> "?, ?, ?"
        const placeholders = year_ids.map(() => "?").join(",");
        const result = db.prepare(`DELETE FROM year WHERE year_id IN (${placeholders})`).run(year_ids);
        return {
            success: true,
            data: {row_id: result.lastInsertRowid},
            mess: `Delete year_id ok`
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
            mess: "Unknow error"
        };
    }
}
