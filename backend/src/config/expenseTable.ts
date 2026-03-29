import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, '../db', 'maindb.db');
const db = new Database(dbPath);


type functionHanldeWithDBType<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

type getAllType = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    time_id: number;
    category_name: string;
    category_id: number;
}

type updateType = {
    change_num: number;
}

type saveType = {
    row_id: number | bigint;
}

// ==================MAIN====================
db.exec(`
    CREATE TABLE IF NOT EXISTS expense(
        expense_id INTEGER NOT NULL,
        day INTEGER,
        category_id INTEGER,
        money INTEGER,
        note VARCHAR(50),
        time_id INTEGER,
        PRIMARY KEY (expense_id)
    )        
`);

/**
 * expense一覧取得
 * @param time_id 
 * @returns 
 */
export function getAll(time_id: number): functionHanldeWithDBType<getAllType[]>
{
    try {
        const query = `
            SELECT ex.expense_id, ex.day, ex.money, ex.note, ca.category_name, ca.category_id
            FROM expense AS ex
            INNER JOIN categories AS ca
            ON ex.category_id = ca.category_id
            WHERE time_id = ?
        `;
        // const query2 = `
        //     SELECT expense.expensepense_id, expense.day, categories.category_name, expense.money, expense.note
        //     FROM expense
        //     INNER JOIN categories
        //     ON expense.category_id = categories.category_id
        //     WHERE time_id = ?
        // `;
        const result = db.prepare(query).all(time_id) as getAllType[];
        console.log("all",db.prepare("SELECT * FROM expense").all());
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
            mess: "Unknow error"
        };
    }
}

/**
 * 
 * @param data 
 * @returns 
 */
export function saveData(data: getAllType): functionHanldeWithDBType<saveType>
{
    try {
        const result = db.prepare(`
            INSERT INTO expense(day, category_id, money, note, time_id) VALUES(?, ?, ?, ?, ?)
        `).run(data.day, data.category_id, data.money, data.note, data.time_id);

        console.log("save expense",result);
        return {
            success: result.lastInsertRowid !=- 0,
            data: {row_id: result.lastInsertRowid},
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
            mess: "Unknow error"
        };
    }
}

/**
 * 
 * @param data 
 * @returns 
 */
export function updateData(data: getAllType): functionHanldeWithDBType<updateType>
{
    try {
        // const placeholders = data.map()
        const result = db.prepare(`
            UPDATE expense SET day = ?, category_id = ?, money = ?, note = ? WHERE expense_id = ?
        `).run(data.day, data.category_id, data.money, data.note, data.expense_id);

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
            mess: "Unknow error"
        };
    }
}


/**
 * 削除処理
 * @param expense_id 
 * @returns 
 */
export function deleteData(expense_id: number[]): functionHanldeWithDBType<updateType>
{
    try {
        const placeholders = expense_id.map(() => "?").join(",");
        const result = db.prepare(`
            DELETE FROM expense WHERE expense_id IN (${placeholders})`).run(expense_id);

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
            mess: "Unknow error"
        };
    }
}