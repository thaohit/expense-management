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
// statistics一覧データタイプ
type statisticsType = {
    month: number;
    sum_mon: number;
    category_id: number;
    category_name: string;
}
// 収入のトータル・支出のトータル
type getInOutType = {
    sumInCome: number;
    sumPay: number;
}
// 一年の支出・収入一覧タイプ
type statisticsDataForYearType = {
    inComeList: string[][];
    spendList: string[][];
    sumIncome: string;
    sumSpend: string;
    remainAmount: string;
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
 * * data.expense_id data.monthが存在するか
 * * data.day
 * * data.money
 * * data.category_id
 * * data.note
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
 * * data.time_id or data.year_id
 * @param data 
 * @returns 
 */
export function checkReqDataForGetStatistics(data?: any): boolean
{
    if (
        data &&
        typeof data === "object"
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
    }

    return {
        success: result,
        data: reqData,
        mess: message,
    }           
}

/**
 * カテゴリーデータをobject→array変換
 * @param data object statisticsType[]
 * @param monthNum 月数
 * @returns string[][]
 */
function handleChangeStatisticsData(data: statisticsType[], monthNum = 12): string[][]
{
    // 月の総金額用の配列を初期化
    let monthArray: string[] = [];
    for (let m = 0; m < monthNum; m++) {
        monthArray[m] = "0";
    }

    let map = new Map<number, string[]>();
    for (let val of data) {
        // =============================================================
        // カテゴリーデータが存在しない場合、生成
        // ["cagegory_name", "sum_mon 1", "sum_mon2",.... "sum_mon_n"]
        // =============================================================
        if (!map.has(val.category_id)) {
            map.set(val.category_id, [val.category_name, ...monthArray]);
        }
        // 該当するカテゴリーの月の総金額を取得
        let setMonth = map.get(val.category_id);
        if (setMonth instanceof Array) {
            // 該当月に総金額を格納し、Mapにセット
            if (monthNum === 12) {
                setMonth[val.month] = val.sum_mon.toString();
            } else {
                setMonth[1] = val.sum_mon.toString();
            }
            map.set(val.category_id, setMonth);
        }
    }
    return Array.from(map.values());
}

/**
 * 支出・収入の総金額取得
 * * 0: 支出
 * * 1: 収入
 * @param type category_type
 * @param id time_id
 * @returns number
 */
function handleGetSumInComeOrSpend(type = [0], id = [0]): number
{
    // 初期化
    let sum: number = 0;

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
        whereIn: {
            fields: ["categories.category_type", "expenses.time_id"],
            values: [type, id],
            connection: "AND"
        },
        isWriteField: true
    }) as {success: boolean, data: {sumInCome: number}, mess: string};

    if (getIncome.success && getIncome.data) {
        sum = getIncome.data.sumInCome;
    }

    return sum;
}

/**
 * time_idsの支出・収入の合計を取得
 * @param time_id number[] 
 * @param type number[] 0:支出, 収入: 1
 * @returns statisticsType
 */
function handleGetStatisticsData(ids: number[], type = [0, 1]): statisticsType[]
{
    // 初期化
    let data: statisticsType[] = [];

    const getData = expensesTable.getAll({
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
        whereIn:{
            fields: ["times.time_id", "categories.category_type"],
            values: [ids, type],
            connection: "AND"
        },
        orderBy: [{
            field: "times.month"
        }],
        groupBy: {
            fields: ["expenses.category_id", "times.month"]
        },
        isWriteField: true
    }) as {success: boolean, data: statisticsType[], mess: string};

    if (getData.success && getData.data) {
        data = getData.data;
    } 
    return data;
}

/**
 * リクエストデータを受け取り、データ取得処理を実行
 * @param data 更新データ
 * @returns hanldeResultType
 */
export function statisticsViewForMonth(data?: any): hanldeResultType<string[][]>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: {time_id: string} = data;
    let statisticsDatas: string[][] = [];
    // データチェック
    if (reqData.time_id && checkNumber(reqData.time_id)) {
        // カテゴリーごとの月の総金額取得
        let getStatisticsDataForMonth = handleGetStatisticsData([parseInt(reqData.time_id)]);
        // 表示用の配列へ変換
        // ["eat", "1", "2", ..... "12"]
        statisticsDatas = handleChangeStatisticsData(getStatisticsDataForMonth, 1);
    } else {
        result = false;
        message = "支出・収入データ取得に失敗しました。"
        console.log("time_idは存在しない。");
    }

    return {
        success: result,
        data: statisticsDatas,
        mess: message
    }
}

/**
 * リクエストデータを受け取り、データ取得処理を実行
 * @param data 更新データ
 * @returns hanldeResultType
 */
export function statisticsViewForYear(data?: any): hanldeResultType<statisticsDataForYearType>
{
    // 変数宣言
    let result: boolean = true;
    let message: string = "";
    let reqData: {year_id: string} = data;
    let statisticsDatas: statisticsDataForYearType = {
        inComeList: [],
        spendList: [],
        sumIncome: "0",
        sumSpend: "0",
        remainAmount: "0"
    };

    // データチェック
    if (reqData.year_id && checkNumber(reqData.year_id)) {
        const getTimeDatas = timesTable.getAll({
            fields: ["time_id, month"],
            where: {
                fields: ["year_id"],
                values: [parseInt(reqData.year_id)]
            }
        }) as {success: boolean, data: {time_id: number}[], mess: string};

        if (getTimeDatas.success && getTimeDatas.data && getTimeDatas.data.length > 0) {
            let time_ids: number[] = getTimeDatas.data.map((val) => val.time_id);
            // 年のカテゴリー総金額を取得
            const getIncome = handleGetStatisticsData(time_ids, [0]);
            const getSpend = handleGetStatisticsData(time_ids, [1]);

            // 表示用の配列へ変換
            // ["eat", "1", "2", ..... "12"]
            statisticsDatas.inComeList = getIncome.length > 0 ? handleChangeStatisticsData(getIncome) : [];
            statisticsDatas.spendList = getSpend.length > 0 ? handleChangeStatisticsData(getSpend) : [];

            // 支出・収入の合計を取得
            let sumInCome = handleGetSumInComeOrSpend([1], time_ids);
            let sumSpend = handleGetSumInComeOrSpend([0], time_ids);
            statisticsDatas.sumIncome = sumInCome.toString();
            statisticsDatas.sumSpend = sumSpend.toString();
            statisticsDatas.remainAmount = (sumInCome - sumSpend).toString();
        } else {
            result = false;
            message = "支出・収入データ取得のためのtime_idが存在しない。"
            console.log("time_idは存在しない。");
        }
    }

    return {
        success: result,
        data: statisticsDatas,
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
        inOutData.sumInCome = handleGetSumInComeOrSpend([1], [parseInt(reqData)]);
        // 総支出
        inOutData.sumPay = handleGetSumInComeOrSpend([0], [parseInt(reqData)]);
    // console.log(inOutData);
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
