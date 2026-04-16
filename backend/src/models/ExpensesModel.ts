import { checkNumber } from "../common/common";
import { ExpensesTable } from "../config/ExpensesTable";


// 処理の戻り値
type hanldeResultType<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

// データ一覧タイプ
type expensesTableType = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    time_id: number;
    category_id: number;
}

type expenseSaveDataType = {
    day: number;
    category_id: number;
    money: number;
    note: string;
    time_id: number;
}

// 保存時のデータタイプ
type saveType = {
    year_id: number;
    month: number;
}

const expensesTable = new ExpensesTable;

/**
 * リクエストデータチェック
 * * data.time_idが存在するか
 * @param data (data.time_id)
 * @returns 
 */
export function checkReqDataForView(data?: any): boolean
{
    if (data && typeof data === "object"  && "time_id" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * リクエストデータチェック
 * * data.day
 * * data.category_id
 * * data.money
 * * data.note
 * * data.time_idが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForSave(data?: any): boolean
{
    if (
        data &&
        typeof data === "object"  &&
        "day" in data &&
        "category_id" in data &&
        "money" in data &&
        "note" in data &&
        "time_id" in data
    ) {
        return true;
    } else {
        return false;
    }
}

/**
 * リクエストデータチェック
 * * data.expense_idsが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForDelete(data?: any): boolean
{
    if (data && typeof data === "object"  && "expense_ids" in data) {
        return true;
    } else {
        return false;
    } 
}

/**
 * リクエストデータチェック
 * * data.time_id data.monthが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForUpdate(data?: any): boolean
{
    if (
        data &&
        typeof data === "object"  && 
            "expense_id" in data && 
            "day" in data &&
            "category_id" in data &&
            "money" in data &&
            "note" in data 
    ) {
        return true;
    } else {
        return false;
    } 
}

/**
 * expenseデータ型のチェック
 * @param data 
 * @returns 
 */
function handleCheck(data?: any): {result: boolean, mess: string}
{
    let resultCheck: boolean = true;
    let message: string = "";
    let convertData: any[];
    
    
    if (data && typeof data === "object") {
        convertData = Object.entries(data);
        convertData.map((val) => {
            if (val[0] === "day") {
                if (!checkNumber(val[1])) {
                    message = "Dayは数値で入力してください。";
                    resultCheck = false;
                }
            } else if (val[0] === "category_id") {
                if (!checkNumber(val[1])) {
                    message = "Categoryは不正な値です。";
                    resultCheck = false;
                }
            } else if (val[0] === "money") {
                if (!checkNumber(val[1])) {
                    message = "Moneyは数値で入力してください。";
                    resultCheck = false;
                }
            } else if (val[0] === "time_id") {
                if (!checkNumber(val[1])) {
                    message = "Timeは不正な値です。";
                    resultCheck = false;
                }
            }
            
            if (resultCheck === false) {
                return;    
            }
        })
        // let beforeCheckData: expensesTableType = data;
        //     if (!checkNumber(beforeCheckData.day)) {
        //         message = "Dayは数値で入力してください。";
        //         resultCheck = false;
        //     }
        //     if (!checkNumber(beforeCheckData.category_id)) {
        //         message = "Categoryは不正な値です。";
        //         resultCheck = false;
        //     }
        //     if (!checkNumber(beforeCheckData.money)) {
        //         message = "Moneyは数値で入力してください。";
        //         resultCheck = false;
        //     }
        //     if (!checkNumber(beforeCheckData.time_id)) {
        //         message = "Timeは不正な値です。";
        //         resultCheck = false;
        //     }
    }

    return {
        result: resultCheck,
        mess: message
    }
}

/**
 * カテゴリ一覧取得
 * 
 * @param data time_id
 * @returns 
 */
export function viewE(data?: any): hanldeResultType<expensesTableType[]>
{
    // 変数宣言
    let message: string = "";
    let result: boolean = true;
    let dataDB: expensesTableType[] = [];

    // 数字確認
    if (checkNumber(data)) {
        // expense一覧取得
        const getData = expensesTable.getAll({
            fields: ["expense_id", "day", "money", "note"],
            join: [{
                joinTable: "categories",
                fieldsJoin: ["category_name", "category_id"],
                on: [{
                    source: "category_id",
                    target: "category_id"
                }],
                joinType: "INNER JOIN"
            }],
            where: {
                field: "time_id",
                value: parseInt(data)
            }
        });

        result = getData.success;
        if (result && getData.data) {
            dataDB = getData.data;
            message = "expenseデータ取得に成功しました。"
        } else {
            message = "expenseデータ取得に失敗しました。"
            console.log("timeデータと該当するexpenseデータが存在しない。")
        }
    } else {
        result = false;
        message = "timeデータは数字または数字ではない。";
    }

    return {
        success: result,
        data: dataDB,
        mess: message
    }
}

/**
 * リクエストデータを受け取り、保存処理を実行
 * @param data 保存データ
 * @returns hanldeResultType
 */
export function saveE(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = false;
    let message: string = "";
    let reqData: expenseSaveDataType = data;
    let getCheckData: {result: boolean, mess: string};

    // データチェック
    getCheckData = handleCheck(reqData);
    if (!getCheckData.result) {
        message = getCheckData.mess;
    } else {
        // 保存
        const saveData = expensesTable.save({
            values: [
                reqData.day,
                reqData.category_id,
                reqData.money,
                reqData.note,
                reqData.time_id
            ]
        });
        if (saveData.success) {
            message = "Categoryデータ保存に成功しました。"
            result = saveData.success;
        } else {
            message = "Categoryデータ保存に失敗しました。"
            result = saveData.success;
        }
    }

    return {
        success: result,
        mess: message,
    }
    
}

/**
 * リクエストデータを受け取り、削除処理を実行
 * @param data 削除データ　expense_ids
 * @returns hanldeResultType
 */
export function deleteE(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: any;
    
    // 配列確認
    if (data instanceof Array) {
        // 数字ではないIDを取得
        let checkData = data.filter((val) => checkNumber(val) !== true);
        if (checkData.length > 0) {
            console.log("Expense_idは数字で入力してください。");
            message = "Expense_idデータは正しくない。"
            reqData = checkData;
            result = false;
        } else {

            const deleteData = expensesTable.delete({
                whereIn: {
                    field: "expense_id",
                    values: data
                }
            });
            console.log(deleteData);
            result = deleteData.success;
            if (deleteData.success === true) {
                message = "Expenseデータ削除に成功しました。"
            } else {
                message = "Expenseデータ削除に失敗しました。"
            }
        }
    } else {
        result = false,
        message = "expense_idsは配列ではない";
    }

    return {
        success: result,
        data: reqData,
        mess: message,
    }
}

/**
 * リクエストデータを受け取り、更新処理を実行
 * @param data 更新データ
 * @returns hanldeResultType
 */
export function updateE(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: expensesTableType = data;
    let getCheckData: {result: boolean, mess: string};    
    
    // データチェック
    getCheckData = handleCheck(reqData);
    if (getCheckData.result) {
        // データ更新チェック
        const getData = expensesTable.get({
            where: {
                fields: ["expense_id"],
                values: [reqData.expense_id]
            }
        }) as {success: boolean, data: expensesTableType, mess: string};

        if (getData && getData.data) {
            if (
                getData.data.day !== reqData.day || 
                getData.data.category_id !== reqData.category_id || 
                getData.data.money !== reqData.money || 
                getData.data.note !== reqData.note
            ) {
                // 更新
                let convertKey = Object.keys(reqData);
                let convertVal = Object.values(reqData);
    
                const updateData = expensesTable.update({
                    fieldAndValue: {fields: convertKey, values: convertVal},
                    where: {field: "expense_id", value: reqData.expense_id}
                })
                if (updateData.success) {
                    message = "Expenseデータ更新に成功しました。"
                } else {
                    message = "Expenseデータ更新に失敗しました。"
                    result = updateData.success;
                }
            } else {
                result = true;
                message = "更新しました。"
            }
        } else {
            result = false;
            message = "更新データが存在しません。"
        }

    } else {
        message = "Expenseデータは不正な値である。"
        result = false;
        console.log(getCheckData.mess);
    }

    return {
        success: result,
        data: reqData,
        mess: message,
    }           
}