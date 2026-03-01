import { hasJapanese, checkString } from "../common/common";
import { saveData } from "../config/loginTable";


/**
 * データ保存
 * @param userName 
 * @param pass 
 * @returns success mess
 */
export function handleSaveData(userName:string, pass:string): object
{

    let result: boolean = false;
    let message: string = "";
    if ( userName !==  "" && pass !== "" ){
        console.log(hasJapanese(userName), userName);
        if (checkString(userName)) {
            const resHandle: any = saveData(userName, pass);
            result = resHandle.success;
            if (!result) {
                if (resHandle.mess.includes("UNIQUE")) {
                    message = "ユーザーが存在しました！"
                } else {
                    message = resHandle.mess;
                }
            }
        } else {
            console.log("ユーザーIDは英語で入力してください!");
            message = "ユーザーIDは英語で入力してください!";
        }
    }
    return { success: result, mess: message};
}

