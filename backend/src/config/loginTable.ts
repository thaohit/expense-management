// import * as sqlite3 from 'sqlite3';
import Database from "better-sqlite3";
import * as path from "path";


const dbPath = path.resolve(__dirname, '../db', 'login.db')
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS login_information(
        user_id INTEGER NOT NULL,
        user_name VARCHAR(20) UNIQUE,
        password VARCHAR(20),
        PRIMARY KEY(user_id)
    )`
);

/** function getAllData
 * ログイン情報を全て取得する
 * @returns result object
 */
export function getAllData():object {

    try {
        const result = db.prepare(`SELECT * FROM login_information`).all();
        if (result.length < 0) {
            return {
                success: false,
                data: {},
                mess: "There is no relevant data!"
            }
        }
        // 全てデータ取得
        return {
            success: true,
            data: result,
            mess: ""
        };
    } catch (error: any) {
        console.log(error.message);
        return {
            success: false,
            data: {},
            mess: error.message
        };
    }
    
}

/** fuction saveData
 * データ保存
 * @param data 登録情報
 * @returns object success, data, mess
 */
export function saveData(userName: string, pass: string): object {

    try {
        const result = db.prepare("INSERT INTO login_information(user_name, password) VALUES(?, ?)").run(userName, pass);
        return { 
            success: true,
            data: result.lastInsertRowid,
            mess: "" 
        };
        
    } catch (error: any) {
        console.log(error.message);
        return { 
            success: false,
            data: {},
            mess: error.message
        };
    }
}

export function findData(userName: string):{} {

    let result: object = {};
    db.prepare("SELECT user_id FROM login_information WHERE user_name = ?").get()
    
    return result;

}

/**
 * データ取得
 * @param userName 
 * @returns ユーザーIDとPW object
 */
export function getData(userName: string): object {

    try {
        const result = db.prepare("SELECT user_name, password FROM login_information WHERE user_name = ?").get(userName);
        if (!result) {
            return {
                success: false,
                data: {},
                mess: `There is not data named ${userName}!!`
            }
        }
        return {
            success: true,
            data: result,
            mess: ""
        };
    } catch (error: any) {
        return {
            success: false,
            data: {},
            mess: error.message
        }
    }
}


export function checkLogin(userName: string): boolean {

    let result: boolean = false;

    db.prepare("SELECT COUNT(user_id) FROM WHERE user_name = ? AND password = ?").get("");

    return result;
}
