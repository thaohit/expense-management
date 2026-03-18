import { Request, Response } from "express";


import * as homeModel from "../models/homeModel";
import * as yearTable from "../config/yearTable";
import * as timeTable from "../config/timeTable";
import { time } from "node:console";
import { checkNumber } from "../common/common";
import { get } from "node:http";

type dataType<T> = {
    time: T;
}

type apiResultType<T> = {
    success: boolean;
    data?: T;
    errCode?: string;
    mess: string;
}

type yearTableType = {
    year_id: number;
    year_name: number;
}

type addYearQuery = {
    addY: number;
}

type getYearQuery = {
    year: number
}

type timeTableType = {
    year?: number;
    time_id?: number;
    month?: number;
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
    let paramY = String(req.query.year);
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
    console.log("viewtimev1 " , getTime);

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

    console.log("save tieme", reqData);
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
    console.log(reqData);
    const resDelete = timeTable.deleteData(reqData);
    console.log("delete time v1. ",resDelete);
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
    const year = req.query.addY;
    // const year = req.query.addY;
    // const year = req.query.addY as string;
    let result: apiResultType<[]>;
    console.log(`check ${year}`, checkNumber(year));
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
    console.log(resDelete);
    result = {
        success: false,
        mess: "test"
    }

    res.json(resDelete);
}

export function updateYearv1(req: Request, res: Response): void
{

}

export function expenseSave(req: Request, res: Response): void
{

}

export function expenseView(req: Request, res: Response): void
{

}

export function times()
{

}