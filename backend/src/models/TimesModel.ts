import { checkNumber } from "../common/common";
import { CategoriesTable } from "../config/CategoriesTable";
import { ExpensesTable } from "../config/ExpensesTable";
import { TimesTable } from "../config/TimesTable";

// 処理の戻り値
type hanldeResultType<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

// データ一覧タイプ
type timeTableType = {
    time_id: number;
    year_id: number;
    month: number;
}

// 保存時のデータタイプ
type saveType = {
    year_id: number;
    month: number;
}

const timesTable = new TimesTable;
const expensesTable = new ExpensesTable;
const categoriesTable = new CategoriesTable;

/**
 * リクエストデータチェック
 * * data.time_idが存在するか
 * @param data (data.year_id)
 * @returns 
 */
export function checkQueryForView(data?: any): boolean
{
    if (data && typeof data === "object" && "year_id" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * リクエストデータチェック
 * * data.year_id, data.monthが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForSave(data?: any): boolean
{
    if (data && typeof data === "object" && "year_id" in data && "month" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * リクエストデータチェック
 * * data.time_idが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForDelete(data?: any): boolean
{
    if (data && typeof data === "object" && "time_ids" in data) {
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
    if (data && typeof data === "object" && "time_id" in data && "month" in data) {
        return true;
    } else {
        return false;
    } 
}



/**
 * timeデータを取得
 */
export function viewT(data?: any): hanldeResultType<timeTableType[]>
{
    // 変数宣言
    let message: string = "";
    let result: boolean = true;
    let dataDB: timeTableType[] = [];

    // 数字確認
    if (checkNumber(data)) {
        // データ取得
        const getData = timesTable.getAll({
            fields: ["*"],
            where: {
                fields: ["times.year_id"],
                values: [parseInt(data)]
            },
            join: [{
                joinTable: "years",
                fieldsJoin: ["year_name"],
                on: [{
                    source: "year_id",
                    target: "year_id"
                }],
                joinType: "INNER JOIN"
            }],
            orderBy: [{
                field: "month",
                direction: "ASC"
            }]
        });

        result = getData.success;
        console.log(getData);
        if (result && getData.data) {
            dataDB = getData.data;
            message = "timeデータ取得に成功しました。"
        } else {
            message = "timeデータ取得に失敗しました。"
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
 * @param data 保存データ any
 * @returns hanldeResultType
 */
export function saveT(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: saveType = data;
    let convertToArr = Object.values(data);

    // 数字チェック
    if (convertToArr.every((val) => checkNumber(val) === true)) {

        // 既存のデータがあるか確認
        const getMonth = timesTable.get({
            fields: ["*"],
            where: {
                fields: ["year_id", "month"],
                values: [reqData.year_id, reqData.month],
                connection: "AND"
            }
        });

        if (getMonth.success && getMonth.data && Object.values(getMonth.data).length > 0) {
            message = `${reqData.month}は既に保存されました。`;
            result = false;
        } else if (!getMonth.success) {
            message = "Timeデータ保存に失敗しました。";
            result = false;
            console.log(getMonth.mess);
        } else {
            // 保存
            const saveData = timesTable.save({values: convertToArr});
            if (saveData.success) {
                message = "Timeデータ保存に成功しました。"
            } else {
                message = "Timeデータ保存に失敗しました。"
                result = saveData.success;
            }
        }
    } else {
        message = "Timeデータは数字で入力してください。"
        result = false;
    }

    return {
        success: result,
        mess: message,
    }
}

/**
 * リクエストデータを受け取り、削除処理を実行
 * @param data 削除データ time_ids
 * @returns hanldeResultType
 */
export function deleteT(data?: any): hanldeResultType<any>
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
            console.log("Timeは数字で入力してください。")
            message = "TimeIDは正しくない。";
            reqData = checkData;
            result = false;
        } else {

            // timeデータと該当するexpenseデータを削除する
            const deleteExpenseData = expensesTable.delete({
                whereIn: {
                    field: "time_id",
                    values: data
                }
            });
            if (deleteExpenseData) {
                console.log("DELETE EXPENSE FOR DELETE TIME OK");

                // timeデータと該当するcategoryデータを削除する
                const deleteCategory = categoriesTable.delete({
                    whereIn: {
                        field: "time_id",
                        values: data
                    }
                })
                if (deleteCategory) {
                    console.log("DELETE CATEGORY FOR DELETE TIME OK");

                    // timeデータ削除
                    const deleteData = timesTable.delete({
                        whereIn: {
                            field: "time_id",
                            values: data
                        }
                    });
                    result = deleteData.success;
                    if (deleteData.success === true) {
                        message = "Timeデータ削除に成功しました。"
                    } else {
                        message = "Timeデータ削除に失敗しました。"
                    }
                } else {
                    result = false;
                    message = "Timeデータ削除に失敗しました。"
                    console.log("DELETE CATEGORY FOR DELETE TIME NG");
                }
            } else {
                result = false;
                message = "Timeデータ削除に失敗しました。"
                console.log("DELETE EXPENSE FOR DELETE TIME NG");
            }
        }
    }

    return {
        success: result,
        data: reqData,
        mess: message,
    }
}

/**
 * リクエストデータを受け取り、削除処理を実行
 * @param data 更新データ 
 * @returns hanldeResultType
 */
export function updateT(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: any = data;

    // 数字チェック
    if (checkNumber(reqData.year_id) && checkNumber(reqData.month)) {
        // 更新
        const updateData = timesTable.update({
            fieldAndValue: {fields: ["month"], values: [reqData.month]},
            where: {field: "time_id", value: reqData.time_id}
        })
        if (updateData.success) {
            message = "Timeデータ更新に成功しました。"
        } else {
            message = "Timeデータ更新に失敗しました。"
            result = updateData.success;
        }
    } else {
        message = "Timeデータは数字で入力してください。"
        result = false;
    }

    return {
        success: result,
        data: reqData,
        mess: message,
    }
}