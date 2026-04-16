import { checkNumber } from "../common/common";
import { CategoriesTable } from "../config/CategoriesTable";
import { ExpensesTable } from "../config/ExpensesTable";
import { TimesTable } from "../config/TimesTable";
import { YearsTable } from "../config/YearsTable";

type hanldeResultType<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

type yearTableType = {
    year_id: number;
    year_name: number;
}

type yearSaveType = {
    year: string;
}

type yearDeleteType = {
    year_ids: number[];
}

type timesTableType = {
    time_id: number;
    year_id: number;
    month: number;
    year_name: number;
}

// DBの操作
const yearsTable = new YearsTable;
const timesTable = new TimesTable;
const expensesTable = new ExpensesTable;
const categoriesTable = new CategoriesTable; 


/**
 * リクエストデータチェック
 * * data.yearが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForSave(data?: any): boolean
{
    if (data && data instanceof Object && "year" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * リクエストデータチェック
 * * data.year_idsが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForDelete(data?: any): boolean
{
    if (data && data instanceof Object && "year_ids" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * リクエストデータチェック
 * * data.year_ids data.year_nameが存在するか
 * @param data 
 * @returns 
 */
export function checkReqDataForUpdate(data?: any): boolean
{
    if (data && data instanceof Object && "year_id" in data && "year_name" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * 年リストを取得する
 * @param data リクエストデータ
 * @returns 
 */
export function viewY(data?: any): hanldeResultType<yearTableType[]>
{
    // 変数宣言
    let message: string = "";
    let result: boolean = true;
    let dataDB: yearTableType[] = [];

    // 年データを取得する
    const getData = yearsTable.getAll({orderBy: [{field: "year_name", direction: "ASC"}]}) as hanldeResultType<yearTableType[]>;
    console.log("years", getData);
    if (getData.success && getData.data) {
        dataDB = getData.data;
        message = "データ取得に成功しました。"
    } else {
        message = "データ取得に失敗しました。"
        console.log(getData.mess);
    }
    return {
        success: result,
        data: dataDB,
        mess: message
    };
}

/**
 * リクエストデータを受け取り、保存処理を実行
 * @param data 保存データ any
 * @returns 
 */
export function saveY(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: any = data;

    // 数字チェック
    if (!checkNumber(data)) {
        // 保存
        const saveData = yearsTable.save({values: [parseInt(reqData.year)]});
        if (saveData.success) {
            message = "Yearデータ保存に成功しました。"
        } else {
            message = "Yearデータ保存に失敗しました。"
            result = saveData.success;
        }
    } else {
        message = "Yearデータは数字で入力してください。"
        result = false;
    }

    return {
        success: result,
        mess: message,
    }
}

/**
 * Year削除
 * * year_idsリストを受け取り、削除処理を実行
 * @param data year_ids[]
 * @returns 
 */
export function deleteY(data?: any): hanldeResultType<any>
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
            console.log("Yearは数字で入力してください。");
            message = "YearIdダータは正しくない。";
            reqData = checkData;
            result = false;
        } else {

            // timeデータ確認
            const getTimeData = timesTable.getAll({
                fields: ["time_id"],
                whereIn: {
                    field: "year_id",
                    values: [data]
                }
            }) as hanldeResultType<{time_id: number}[]>;
            console.log(getTimeData, data);
            // データ存在する場合、先に削除する
            if (getTimeData.success) {
                if (getTimeData.data && getTimeData.data.length > 0) {
                    // object time id から配列へ変換
                    const convertTimeData = getTimeData.data.map((val) => val.time_id);
                    
                    // expense data確認
                    const getExpenseData = expensesTable.getAll({
                        fields: ["expense_id"],
                        whereIn: {
                            field: "time_id",
                            values: convertTimeData
                        }
                    }) as hanldeResultType<{expense_id: number}[]>;
                    // 存在する場合、削除する
                    if (getExpenseData.success && getExpenseData.data && getExpenseData.data.length > 0) {
                        const delExpenseData = expensesTable.delete({
                            whereIn: {
                                field: "time_id",
                                values: convertTimeData
                            }
                        });

                        if (delExpenseData.success) {
                            console.log("DELETE EXPENSE FOR DELETE YEAR OK");
                        } else {
                            console.log("DELETE EXPENSE FOR DELETE YEAR NG");
                        }
                    }

                    // category data確認
                    const getCategoryData = categoriesTable.getAll({
                        whereIn: {
                            field: "time_id",
                            values: convertTimeData
                        }
                    }) as hanldeResultType<{category_id: number}[]>;
                    // 存在する場合、削除する
                    if(getCategoryData.success && getCategoryData.data && getCategoryData.data.length > 0) {
                        const delCategoryData = categoriesTable.delete({
                            whereIn: {
                                field: "time_id",
                                values: convertTimeData
                            }
                        });

                        if (delCategoryData.success) {
                            console.log("DELETE CATEGORY FOR DELETE YEAR OK");
                        } else {
                            console.log("DELETE CATEGORY FOR DELETE YEAR NG");
                        }
                    }

                    // time data削除
                    const deleteTimeData = timesTable.delete({
                        whereIn: {
                            field: "time_id",
                            values: [convertTimeData]
                        }
                    });

                    if (deleteTimeData.success){
                        console.log("DELETE TIME FOR DELETE YEAR OK");
                    } else {
                        console.log("DELETE TIME FOR DELETE YEAR OK");
                    }
                }
                // expense, category, time削除後、year削除する
                const deleteData = yearsTable.delete({
                    whereIn: {
                        field: "year_id",
                        values: data
                    }
                }) ;
                result = deleteData.success;
                if (deleteData.success === true) {
                    message = "yearデータ削除に成功しました。"
                } else {
                    message = "yearデータ削除に失敗しました。"
                }
            } else {
                console.log("GET TIME DATA FOR DELETE YEAR NG");
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
 * Year更新
 * * year_idsリストを受け取り、削除処理を実行
 * @param data year_ids[]
 * @returns 
 */
export function updateY(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: any = data;

    // 数字チェック
    if (checkNumber(reqData.year_id) && checkNumber(reqData.year_name)) {
        // 更新
        const updateData = yearsTable.update({
            fieldAndValue: {fields: ["year_name"], values: [reqData.year_name]},
            where: {field: "year_id", value: reqData.year_id}
        })
        if (updateData.success) {
            message = "Yearデータ更新に成功しました。"
        } else {
            message = "Yearデータ更新に失敗しました。"
            result = updateData.success;
        }
    } else {
        message = "Yearデータは数字で入力してください。"
        result = false;
    }

    return {
        success: result,
        data: reqData,
        mess: message,
    }
}