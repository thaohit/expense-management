import { checkNumber } from "../common/common";
import { CategoriesTable } from "../config/CategoriesTable";
import { ExpensesTable } from "../config/ExpensesTable";
import { TimesTable } from "../config/TimesTable";
import { YearsTable } from "../config/YearsTable";


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

type statisticsDataType = {
    month: number;
    sum_mon: number;
}
// statistics一覧データタイプ
type statisticsType = {
    datas: string[];
}

type stType = {
    month: number;
    sum_mon: number;
    category_id: number;
    category_name: string;
}

// データ一覧タイプ
type getCategoryDataType = {
    category_id: number;
    category_name: string;
    category_type: number;
    time_id: number;
}

//
type getInOutType = {
    sumInCome: number;
    sumPay: number;
}

// テーブル生成
const expensesTable = new ExpensesTable;
const categoriesTable = new CategoriesTable;
const yearsTable = new YearsTable;
const timesTable = new TimesTable;

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
 * クエリデータチェック
 * * data.time_id
 * @param data 
 * @returns 
 */
export function checkReqDataForGetStatistics(data?: any): boolean
{
    if (data && typeof data === "object" && "time_id" in data) {
        return true;
    } else {
        return false;
    }
}

/**
 * クエリデータチェック
 * * data.time_id
 * @param data 
 * @returns 
 */
export function checkReqDataForGetInOutType(data?: any): boolean
{
    if (data && typeof data === "object" && "time_id" in data) {
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
                fields: ["expenses.time_id"],
                values: [parseInt(data)]
            }
        });
        console.log(getData);
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

/**
 * リクエストデータを受け取り、データ取得処理を実行
 * @param data 更新データ
 * @returns hanldeResultType
 */
export function statisticsView(data?: any): hanldeResultType<string[][]>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: string[] = data;
    let statistcsDatas: string[][] = [];

    // データチェック
    if (reqData && checkNumber(reqData)) {
        // カテゴリー総金額を取得
        const getSum = expensesTable.getAll({
            fields: [
                "times.month", "SUM(expenses.money) as sum_mon, expenses.category_id, categories.category_name"
            ],
            join: [
                {
                    joinTable: "times",
                    on: [{
                        source: "time_id",
                        target: "time_id"
                    }],
                    joinType: "INNER JOIN"
                },
                {
                    joinTable: "categories",
                    on: [{
                        source: "category_id",
                        target: "category_id"
                    }],
                    joinType: "LEFT JOIN"
                }
            ],
            where:{
                fields: ["times.time_id"],
                values: [reqData]
            },
            orderBy: [{
                field: "times.month"
            }],
            groupBy: {
                fields: ["expenses.category_id", "times.month"]
            },
            run: true,
            isWriteField: true
        }) as {success: boolean, data: stType[], mess: string};

        if (getSum.success && getSum.data) {
            let map = new Map<number, string[]>();
            // // 最大月取得
            // let maxMonth = (getSum.data.reduce((pre, cur) => (pre.month > cur.month) ? pre : cur)).month;
            // let months = [];
            // // カテゴリーごとの月の初期化
            // for (let m = 0; m < maxMonth; m++) {
            //     months.push("0");
            // }
            // // カテゴリーごとの月の総金額取得
            // for (let val of getSum.data) {
            //     // カテゴリーデータが存在しない場合、生成
            //     if (!map.has(val.category_id)) {
            //         map.set(val.category_id, [val.category_name, ...months]);
            //     }
            //     // 該当するカテゴリーの月の総金額を取得
            //     let setMonth = map.get(val.category_id);
            //     if (setMonth instanceof Array) {
            //         // 該当月に総金額を格納し、Mapにセット
            //         setMonth[val.month] = val.sum_mon.toString();
            //         map.set(val.category_id, setMonth);
            //     }
            // }
            // カテゴリーごとの月の総金額取得
            for (let val of getSum.data) {
                // カテゴリーデータが存在しない場合、生成
                if (!map.has(val.category_id)) {
                    map.set(val.category_id, [val.category_name]);
                }
                // 該当するカテゴリーの月の総金額を取得
                let setMonth = map.get(val.category_id);
                if (setMonth instanceof Array) {
                    // 該当月に総金額を格納し、Mapにセット
                    setMonth[1] = val.sum_mon.toString();
                    map.set(val.category_id, setMonth);
                }
            }
            statistcsDatas = Array.from(map.values());
        } else {
            result = false;
            message = "支出・収入データ取得に失敗しました。"
            console.log("category_dataは存在しない。");
        }
        
    } else {
        result = false;
        message = "支出・収入データ取得に失敗しました。"
        console.log("time_idは存在しない。");
    }
    console.log(statistcsDatas);
    return {
        success: result,
        data: statistcsDatas,
        mess: message
    }
}

/**
 * リクエストデータを受け取り、支出・収入データ取得処理を実行
 * @param data time_id
 * @returns hanldeResultType
 */
export function statisticsInOutView(data?: any): hanldeResultType<getInOutType>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: string = data;
    let inOutData: getInOutType = {sumInCome: 0, sumPay: 0}; 

    // データチェック
    if (reqData && checkNumber(reqData)) {
        // 総収入
        const getIncome = expensesTable.get({
            fields: ["COALESCE(SUM(expenses.money), 0) AS sumInCome"],
            join: [{  
                joinTable: "categories",
                on: [{
                    source: "category_id",
                    target: "category_id"
                }],
                joinType: "INNER JOIN"
            }],
            where: {
                fields: ["categories.category_type", "expenses.time_id"],
                values: [1, parseInt(reqData)],
                connection: "AND"
            },
            isWriteField: true
        }) as {success: boolean, data: {sumInCome: number}, mess: string};

        if (getIncome.success && getIncome.data) {
            inOutData.sumInCome = getIncome.data.sumInCome
        } else {
            inOutData.sumInCome = 0;
        }
        // 総支出
        const getPay = expensesTable.get({
            fields: ["COALESCE(SUM(expenses.money), 0) AS sumPay"],
            join: [{  
                joinTable: "categories",
                on: [{
                    source: "category_id",
                    target: "category_id"
                }],
                joinType: "INNER JOIN"
            }],
            where: {
                fields: ["expenses.time_id", "categories.category_type"],
                values: [parseInt(reqData), 0],
                connection: "AND"
            },
            isWriteField: true,
        }) as {success: boolean, data: {sumPay: number}, mess: string};

        if (getPay.success && getPay.data) {
            inOutData.sumPay = getPay.data.sumPay
        } else {
            inOutData.sumPay = 0;
        }
    console.log(inOutData);
    } else {
        result = false;
        message = "支出・収入データ取得に失敗しました。"
        console.log("time_idは存在しない。");
    }

    return {
        success: result,
        data: inOutData,
        mess: message
    }
}
