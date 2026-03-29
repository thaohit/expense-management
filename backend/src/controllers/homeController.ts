import { Request, Response } from "express";


import * as homeModel from "../models/homeModel";
import * as yearTable from "../config/yearTable";
import * as timeTable from "../config/timeTable";
import * as categoryTable from "../config/categoryTable";
import * as expenseTable from "../config/expenseTable";

import { checkNumber } from "../common/common";


type dataType<T> = {
    time: T;
}

type apiResultType<T> = {
    success: boolean;
    data?: T;
    errCode?: string;
    mess: string;
}
// ==========YEAR==========
type yearTableType = {
    year_id: number;
    year_name: number;
}

type addYearQuery = {
    addY: string;
}

type getYearQuery = {
    year: string
}
// ==========TIME==========
type timeTableType = {
    year?: number;
    time_id?: number;
    month?: number;
}

// ==========CATEGORY==========
type getCategoryType = {
    mode: string,
    month: string,
    year: string
}

type saveCategoryType = {
    name: string,
    year: number,
    month: number
}

type updateCategoryType = {
    category_id: string,
    category_name: string
}

type deleteCategoryType = {
    category_id: string[];
}

// ==========EXPENSE==========
type getExpenseQuery = {
    time_id: string;
}

type getAllType = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    time_id: number;
    category_id: number;
    category_name: string;
}

type requestExpenseDataType = {
    expense_id: string;
    day: string;
    money: string;
    note: string;
    time_id: string;
    category_id: string;
    category_name: string;
}

/**
 * 月の一覧を取得
 * @param rep 
 * @param res 
 */
export function viewTimev1(req: Request<{}, {}, {}, getYearQuery>, res: Response): void
{
    // 変数宣言
    let result: apiResultType<timeTableType[]> = {
        success: false,
        mess: "There is not timedata"
    };
    let timeData: timeTableType[] = [];
    let message: string = ""
    let makeTimeData: timeTableType;
    // {
    //     year: "",
    //     time_id: [],
    //     month: []
    // };
    let paramY = req.query.year;
    // let condition: string = `year = ${res.body.}`;

    // 年の配列を作成する
    // const getYears = yearTable.getAll();
    // const years = getYears.data?.map((val) => val.year_name);

    // データを全て取得
    // years?.map((val) => {
        // // 年ごとに、timeダータを取得
        // const getTime = timeTable.getAll(1, "time_id, month", "year", val);

        // let months: string[] = [];
        // let time_ids: string[] = [];
        // if (getTime.success && getTime.data && getTime.data.length > 0) {
            
        //     // timeTableからデータを取得したら、timeTalbeType用の変数に代入
        //     getTime.data.map((valTime) => {
        //         time_ids.push(valTime.time_id);
        //         months.push(valTime.month);
        //     })
        //     // timeTableTypeにデータを格納するため、先にmakeTimeDataにデータを代入し形成
        //     makeTimeData.year = val;
        //     makeTimeData.time_id = time_ids;
        //     makeTimeData.month = months;

        //     timeData.push(makeTimeData)
        // }

    // });
    const getTime = timeTable.getAll(1, "*", "year", paramY);

    // if (!getTime.success) {
    //     res.json(getTime);
    //     return;
    // } else {
    //     if (getTime.data && getTime.data.length > 0) {
            
    //     }
    // }
    // 一時的に変数を使う、今後使わない場合、削除して良い
    // message = getTime.mess;
    
    // ResquestのJSONを調整
    // result = {
    //     success: getTime.success,
    //     data: timeData,
    //     mess: message
    // };
    // console.log("viewtimev1 " , getTime);

    res.json(getTime);
    
}

/**
 * 
 * @param req 
 * @param res 
 */
export function saveTimev1(req: Request, res: Response): void
{
    // 変数宣言
    let result: apiResultType<[]>;
    let message: string;
    const reqData: {
        year: number;
        month: number;
    } = req.body;

    // 入力チェック
    if (!checkNumber(reqData.month)) {
        res.json({
            success: false,
            mess: `Month は数字で入力してください`
        })
        return;
    }
    // 既存データ確認
    const getTimeId = timeTable.getData(reqData.year, reqData.month);

    if (getTimeId.success && getTimeId.data && getTimeId.data.time_id !== 0) {
        result = {
            success: false,
            mess: `${reqData.year}年の${reqData.month}月が存在しました！！`
        }
        res.json(result);
        return;
    }

    const resSave = timeTable.saveData(reqData);

    // 保存処理チェック
    if (!resSave.success) {
        message = resSave.mess;
    } {
        message = "Save time OK!";
    }

    // ResquestのJSONを調整
    result = {
        success: resSave.success,
        mess: message
    }

    res.json(result);

}

/**
 * 
 * @param req 
 * @param res 
 */
export function deleteTimev1(req: Request, res: Response): void
{
    // 変数宣言
    let result: apiResultType<[]>;
    let message: string;
    const reqData = req.body;
    const resDelete = timeTable.deleteData(reqData);
    if (!resDelete.success) {
        message = resDelete.mess;
    } else {
        message = "Delete time OK!!";
    }

    // ResquestのJSONを調整
    result = {
        success: resDelete.success,
        mess: message
    };

    res.json(result);
}

/**
 * version: v1. 年の一覧を取得
 * * APIから一覧データ取得の要求を処理する
 * @param rep 
 * @param res 
 */
export function viewYearv1(req: Request, res: Response): void
{

    // 変数宣言
    let result: apiResultType<yearTableType[]>;
    let years: yearTableType[] = [];
    let message: string = "";

    // 年の一覧を取得
    const getYear = yearTable.getAll();
    if (getYear.success && getYear.data) {
        years = getYear.data;
        message = "Get Year OK!!";
    }

    // ResponseのJSONを調整
    result = {
        success: getYear.success,
        data: years,
        mess: message
    };

    res.json(result);
}

/**
 * version: V1. 年保存処理
 * * APIから保存要求を処理する
 * @param req 
 * @param res 
 * @returns 処理後、
 */
export function saveYearv1(req: Request<{}, {}, {}, addYearQuery>, res: Response): void
{
    // 変数宣言
    const year = parseInt(req.query.addY);
    // const year = req.query.addY;
    // const year = req.query.addY as string;
    let result: apiResultType<[]>;
    // yearの型チェック
    // if (typeof year !== "string") {
    //     res.status(400).json({
    //         success: false,
    //         mess: "Invalid year"
    //     });
    //     return;
    // }

    if (!checkNumber(year)) {
        res.json({
            success: false,
            mess: `Year は数字で入力してください`
        })
        return;
    }
    const resSave = yearTable.saveData(year);
    
    // ResponseのJSONを調整
    result = {
        success: resSave.success,
        mess: resSave.mess
    };
    res.json(result);
}

/**
 * version: V1. 年を削除
 * * APIから処理要求を処理する
 * 
 * @param req 
 * @param res 
 */
export function deleteYearv1(req: Request, res: Response): void
{
    const years = req.body as number[];

    let result: apiResultType<[]>;

    // if (typeof years !== "string") {
    //     res.status(400).json({ message: ""});
    // }

    const resDelete = yearTable.deleteData(years);
    result = {
        success: false,
        mess: "test"
    }

    res.json(resDelete);
}

export function updateYearv1(req: Request, res: Response): void
{

}

/**
 * version: V1. categoryの一覧を取得
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function viewCategoryv1(req: Request<{}, {}, {}, getCategoryType>, res: Response): void
{
    const mod = parseInt(req.query.mode);
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);
    const result = categoryTable.getAll(mod, year, month);

    res.json(result);

}

/**
 * version: V1. categoryを保存
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function saveCategoryv1(req: Request, res: Response): void
{
    const reqData = req.body as saveCategoryType;
    const result = categoryTable.saveData(reqData);

    
    res.json(result);

}


/**
 * version: V1. categoryを削除
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function deleteCategoryv1(req: Request, res: Response): void
{
    const reqData = req.body as string[];
    const ids: number[] = reqData.map(Number);
    const result = categoryTable.deleteData(ids);
    
    res.json(result);

}

/**
 * version: V1. categoryを更新
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function updateCategoryv1(req: Request, res: Response): void
{
    const reqData = req.body as updateCategoryType;
    const id: number = parseInt(reqData.category_id);
    const name: string = reqData.category_name;
    const result = categoryTable.updateData(id, name);

    
    res.json(result);

}

export function saveExpensev1(req: Request, res: Response): void
{
    const reqData = req.body as string[];
    
    // const makeSaveData: object = {
    //     day: parseInt(reqData.day),
    //     category_id: parseInt(reqData.category_id),
    //     money: parseInt(reqData.money),
    //     note: reqData.note,
    //     time_id: reqData.time_id
    // }

    // const makeData: getAllType = {
    //     expense_id: 0,
    //     day: ,


    // }

    let testt: getAllType = {
        expense_id: 0,
        day: 0,
        money: 0,
        note: "",
        time_id: 0,
        category_id: 0,
        category_name: ""
    };
    reqData.map((val, index) => {
        switch (index){
            case 0:
                testt.day = parseInt(val);
                break;
            case 1:
                testt.category_id = parseInt(val);
                break;
            case 2:
                testt.money = parseInt(val);
                break;
            case 3:
                testt.note = val;
                break;
            case 4:
                testt.time_id = parseInt(val);
                break;
        }
    })
    const result = expenseTable.saveData(testt); 
    console.log(result);
    res.json(result);

}

export function viewExpensev1(req: Request<{}, {}, {}, getExpenseQuery>, res: Response): void
{
    const reqTimeID = req.query.time_id;
    const result = expenseTable.getAll(parseInt(reqTimeID));
    console.log("view", reqTimeID,result);

    res.json(result);
}

export function deleteExpensev1(req: Request, res: Response): void
{
    const ids: string[] = req.body;
    let changeId: number[] = [];
    if (ids.length > 0) {
        changeId = ids.map((val) => parseInt(val));
        const result = expenseTable.deleteData(changeId);
        
        res.json(result);
    } else {
        res.json({
            success: false,
            mess: "There is not expense_id"
        })
        return;
    }


}

export function updateExpensev1(req: Request, res: Response): void
{
    const datas = req.body as requestExpenseDataType;

    const makeData: getAllType = {
        day: parseInt(datas.day),
        category_id: parseInt(datas.category_id),
        money: parseInt(datas.money),
        note: datas.note,
        expense_id: parseInt(datas.expense_id),
        category_name: datas.category_name,
        time_id: 0
    };
    
    const result = expenseTable.updateData(makeData);
    
    res.json(result);
}