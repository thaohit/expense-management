import { checkString, hasJapanese } from '../common/common';
import * as loginTable from '../config/loginTable';

/** function handleCheckLogin
 * ログイン情報チェック処理
 * @param userName  ユーザーID  string
 * @param pass  パスワード  string
 * @returns result boolean
 * */ 
export function handleCheckLogin(userName:string, pass:string): boolean
{

    let result:boolean = false;

    if (checkString(userName)) {
        const getDB: any = loginTable.getData(userName);
        console.log(getDB);
        if(Object.keys(getDB.data).length > 0) {
            const loginData:string [] = Object.values(getDB.data);
            if(loginData[1] !== null && loginData[1] === pass) {
                result = true;
            } 
        }
    }
    return result;
}
