import { checkNumber, checkString, checkVietNamese } from "../common/common";
import { CategoriesTable } from "../config/CategoriesTable";
import { TimesTable } from "../config/TimesTable";

// 処理の戻り値
type hanldeResultType<T> = {
    success: boolean;
    data?: T;
    mess: string;
}

// データ一覧タイプ
type categoryTableType = {
    category_id: number;
    category_name: string;
    category_type: number;
    time_id: number;
}

// データ保存タイプ
type categorySaveType = {
    category_id?: number;
    category_name: string; 
    category_type: number;
    time_id: number
}

// データ更新タイプ
type categoryUpdateType = {
    category_id: number;
    category_name: string;
}

// 年ごとのカテゴリーリストタイプ
type listCategoryGetTime = {
    month: number;
    year_name: number;
    time_id: number;
}

type listCategoryGetCategory = {
    category_id: number;
    category_name: string;
    category_type: number;
}

type listCategoryByYear = {
    month: number;
    year_name: number;
    time_id: number;
    categoryData: {
        category_id: number;
        category_name: string;
        category_type: number;
    }[];
}

// DBの操作
const categoriesTable = new CategoriesTable;
const timesTable = new TimesTable;

type viewType = {
    time_id: number;
}

/**
 * リクエストデータチェック
 * * data.time_idが存在するか
 * @param data (data.time_id)
 * @returns 
 */
export function checkQueryForView(data?: any): boolean
{
    if (data && typeof data === "object" && "time_id" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * リクエストデータチェック
 * * data.time_idが存在するか
 * * data.category_name
 * * data.category_type
 * @param data (data.time_id)
 * @returns 
 */
export function checkReqDataForSave(data?: any): boolean
{
    if (
        data &&
        typeof data === "object" &&
        "category_name" in data &&
        "category_type" in data &&
        "time_id" in data
    ) {
        return true;
    } else {
        return false;
    }   
}

/**
 * リクエストデータチェック
 * * data.category_idが存在するか
 * @param data (data.category_id)
 * @returns 
 */
export function checkReqDataForDelete(data?: any): boolean
{
    if (data && typeof data === "object" && "category_ids" in data) {
        return true;
    } else {
        return false;
    }   
}

/**
 * リクエストデータチェック
 * * data.category_idが存在するか
 * @param data (data.category_id data.category_name)
 * @returns 
 */
export function checkReqDataForUpdate(data?: any): boolean
{
    if (data && typeof data === "object" && "category_id" in data && "category_name" in data) {
        return true;
    } else {
        return false;
    }   
}

/**
 * カテゴリ一覧取得
 * 
 * @param data time_id
 * @returns 
 */
export function viewC(data?: any): hanldeResultType<categoryTableType[]>
{
    // 変数宣言
    let message: string = "";
    let result: boolean = true;
    let dataDB: categoryTableType[] = [];

    // 数字確認
    if (checkNumber(data)) {
        const getData = categoriesTable.getAll({
            where: {
                field: "time_id",
                value: parseInt(data)
            }
        });

        result = getData.success;
        if (result && getData.data) {
            dataDB = getData.data;
            message = "categoryデータ取得に成功しました。"
        } else {
            message = "categoryデータ取得に失敗しました。"
            console.log("timeデータと該当するcategoryデータが存在しない。")
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
export function saveC(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: categorySaveType = data;
    
        // 数字チェック
        if (checkVietNamese(reqData.category_name)) {
            // 保存
            const saveData = categoriesTable.save({
                values: [reqData.category_name, reqData.category_type, reqData.time_id]
            });
            if (saveData.success) {
                message = "Categoryデータ保存に成功しました。"
            } else {
                message = "Categoryデータ保存に失敗しました。"
                result = saveData.success;
            }
            console.log(saveData, reqData);
        } else {
            message = "Categoryデータは文字列で入力してください。"
            result = false;
        }
    
    
        return {
            success: result,
            mess: message,
        }
    
}

/**
 * リクエストデータを受け取り、削除処理を実行
 * @param data 削除データ
 * @returns hanldeResultType
 */
export function deleteC(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: any;
    console.log("id = ", data);
    // 配列確認
    if (data instanceof Array) {
        // 数字ではないIDを取得
        let checkData = data.filter((val) => checkNumber(val) !== true);
        if (checkData.length > 0) {
            console.log("Category_idは数字で入力してください。");
            message = "Category_idデータは正しくない。"
            reqData = checkData;
            result = false;
        } else {
            const deleteData = categoriesTable.delete({
                whereIn: {
                    field: "category_id",
                    values: data
                }
            });
            result = deleteData.success;
            if (deleteData.success === true) {
                message = "Categoryデータ削除に成功しました。"
            } else {
                message = "Categoryデータ削除に失敗しました。"
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
 * リクエストデータを受け取り、更新処理を実行
 * @param data 更新データ
 * @returns hanldeResultType
 */
export function updateC(data?: any): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: categoryUpdateType = data;

    // 数字と文字列確認
    if (checkNumber(reqData.category_id) && checkVietNamese(reqData.category_name)) {
        // 更新
        const updateData = categoriesTable.update({
            fieldAndValue: {fields: ["category_name"], values: [reqData.category_name]},
            where: {field: "category_id", value: reqData.category_id}
        })
        if (updateData.success) {
            message = "Categoryデータ更新に成功しました。"
        } else {
            message = "Categoryデータ更新に失敗しました。"
            result = updateData.success;
        }
    } else {
        message = "Categoryデータは不正な値である。"
        result = false;
    }

    return {
        success: result,
        data: reqData,
        mess: message,
    }           
}

/**
 * 年ごとのカテゴリーリストを取得する
 * @returns hanldeResultType
 */
export function getCategoryByYear(): hanldeResultType<any>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let listData: listCategoryByYear = {
        month: 0,
        year_name: 0,
        time_id: 0,
        categoryData: []
    };
    let listTime: listCategoryGetTime[] = [];
    let listCategory: listCategoryGetCategory[] = [];
    let resultData: listCategoryByYear[] = [];

    // timeデータ取得
    const getTime = timesTable.getAll({
        fields: ["month, time_id"],
        join: [
            {
                fieldsJoin: ["year_name"],
                joinTable: "years",
                joinType: "INNER JOIN",
                on: [{
                    source: "year_id",
                    target: "year_id"
                }]
            }
        ]}
    );
    if (getTime) {
        // timeデータが存在する場合、カテゴリデータを取得する
        if (getTime.data) {
            listTime = getTime.data;
            listTime.map((val, index) => {
                listData.time_id = val.time_id;
                listData.month = val.month;
                listData.year_name = val.year_name;
                listData.categoryData = [];

                const getData = categoriesTable.getAll({
                    fields: ["category_id", "category_name", "category_type"],
                    where: {
                        field: "time_id",
                        value: val.time_id
                    }
                });
                if (getData.success && getData.data) {
                    listCategory = getData.data;
                    listData.categoryData = listCategory;
                }
                resultData[index] = {...listData};                
            });
        }
        message = "年ごとのカテゴリリスト取得に成功しました。";
    } else {
        result = false;
        message = "年ごとのカテゴリリスト取得に失敗しました。";
    }

    return {
        success: result,
        data: resultData,
        mess: message
    }
}
