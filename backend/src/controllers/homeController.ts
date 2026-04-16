import { Request, Response } from "express";


import * as homeModel from "../models/homeModel";
import * as yearTable from "../config/yearTable";
import * as timeTable from "../config/timeTable";
import * as categoryTable from "../config/categoryTable";
import * as expenseTable from "../config/expenseTable";

import { checkNumber } from "../common/common";

import * as yearsModel from "../models/YearsModel";
import * as categoriesModel from "../models/CategoriesModel";
import * as timesModel from "../models/TimesModel";
import * as expensesModel from "../models/ExpensesModel";

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
    year_id: string;
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
    time_id: number
}

type categoryTableType = {
    category_id?: number,
    category_name?: string,
    year?: number,
    month?: number,
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
 * version: v2. timeのデータ一覧取得
 * * APIから一覧データ取得の要求を処理する
 * @param rep 
 * @param res 
 */
export function viewTimev2(req: Request<{}, {}, {}, addYearQuery>, res: Response): void
{
    const reqData = req.query;
    // リクエストデータ確認
    if (timesModel.checkQueryForView(reqData)) {
        const getData = timesModel.viewT(reqData.year_id);

        if (getData.success) {
            console.log("VIEW TIME OK");
        } else {
            console.log("VIEW TIME NG");
        }
        res.json(getData);
    } else {
        console.log("リクエストにtime_idが存在しない。")
        res.json({
            success: false,
            mess: "データ取得に失敗しました。"
        })
    }
}

/**
 * version: v2. データ保存処理
 * * APIから一覧データ取得の要求を処理する
 * @param rep 
 * @param res 
 */
export function saveTimev2(req: Request, res: Response): void
{
    // 変数宣言
    const reqData = req.body;

    if (timesModel.checkReqDataForSave(reqData)) {
        const saveData = timesModel.saveT(reqData);
        if (saveData.success) {
            console.log("SAVE TIME OK");
        } else {
            console.log("SAVE TIME NG");
        }
        res.json(saveData);
    } else {
        console.log("SAVE TIME NG");
        res.json({
            success: false,
            mess: "保存データが正しくない。"
        })
    }
}

/**
 * version: v2. timeのデータを削除
 * * APIから一覧データ取得の要求を処理する
 * @param rep 
 * @param res 
 */
export function deleteTimev2(req: Request, res: Response): void
{
    // 変数宣言
    const reqData = req.body;

    if (timesModel.checkReqDataForDelete(reqData)) {
        const resDelete = timesModel.deleteT(reqData.time_ids);

        if (resDelete.success) {
            console.log("DELETE TIME OK");
        } else {
            console.log("DELETE TIME NG");
        }

        res.json(resDelete);
    } else {
        console.log("DELETE TIME NG");
        res.json({
            success: false,
            mess: "削除データが存在しない。または削除データが正しくない。"
        })
    } 
}

/**
 * version: V2. 年を更新
 * * APIから処理要求を処理する
 * 
 * @param req 
 * @param res 
 */
export function updateTimev2(req: Request, res: Response): void
{
    const reqData = req.body;
    
    if (timesModel.checkReqDataForUpdate(reqData)) {
        const resUpdate = timesModel.updateT(reqData);

        if (resUpdate.success) {
            console.log("UPDATE TIME OK");
        } else {
            console.log("UPDATE TIME NG");
        }

        res.json(resUpdate);
    } else {
        console.log("UPDATE TIME NG");
        res.json({
            success: false,
            mess: "更新データが存在しない。または更新データが正しくない。"
        })
    } 
}

/**
 * version: v2. 年の一覧を取得
 * * APIから一覧データ取得の要求を処理する
 * @param rep 
 * @param res 
 */
export function viewYearv2(req: Request, res: Response): void
{
    // 変数宣言
    let result: apiResultType<yearTableType[]>;
    let datas: yearTableType[] = [];
    let message: string = "";

    const getYears = yearsModel.viewY();
    if (getYears.success) {
        console.log("Get Years OK");
    } else {
        console.log("Get Years NG");
    }

    res.json(getYears);
}

/**
 * version: V2. 年保存処理
 * * APIから保存要求を処理する
 * @param req 
 * @param res 
 * @returns 処理後、
 */
export function saveYearv2(req: Request, res: Response): void
{
    // 変数宣言
    const reqData = req.body;
    if (yearsModel.checkReqDataForSave(reqData)) {
        const saveData = yearsModel.saveY(reqData);
        if (saveData.success) {
            console.log("Save Year OK");
        } else {
            console.log("Save Year NG");
        }

        res.json(saveData);
    } else {
        console.log("Save Year NG");
        res.json({
            success: false,
            mess: "入力データが存在しない。または正しくない。"
        })
    }
}

/**
 * version: V2. 年を削除
 * * APIから処理要求を処理する
 * 
 * @param req 
 * @param res 
 */
export function deleteYearv2(req: Request, res: Response): void
{
    const reqData = req.body;
    
    if (yearsModel.checkReqDataForDelete(reqData)) {
        const resDelete = yearsModel.deleteY(reqData.year_ids);

        if (resDelete.success) {
            console.log("DELETE YEAR OK");
        } else {
            console.log("DELETE YEAR NG");
        }

        res.json(resDelete);
    } else {
        console.log("DELETE YEAR NG");
        res.json({
            success: false,
            mess: "削除データが存在しない。または削除データが正しくない。"
        })
    } 
}

/**
 * version: V2. 年を更新
 * * APIから処理要求を処理する
 * 
 * @param req 
 * @param res 
 */
export function updateYearv2(req: Request, res: Response): void
{
    const reqData = req.body;
    
    if (yearsModel.checkReqDataForUpdate(reqData)) {
        const resUpdate = yearsModel.updateY(reqData);

        if (resUpdate.success) {
            console.log("UPDATE YEAR OK");
        } else {
            console.log("UPDATE YEAR NG");
        }

        res.json(resUpdate);
    } else {
        console.log("UPDATE YEAR NG");
        res.json({
            success: false,
            mess: "更新データが存在しない。または更新データが正しくない。"
        })
    } 
}

/**
 * version: V2. categoryの一覧を取得
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function viewCategoryv2(req: Request, res: Response): void
{
    const reqQuery = req.query;

    if (categoriesModel.checkQueryForView(reqQuery)) {
        const getData = categoriesModel.viewC(reqQuery.time_id);
        if (getData.success) {
            console.log("GET CATEGORY OK");
        } else{
            console.log("GET CATEGORY NG");
        }
        res.json(getData);
    } else {
        console.log("GET CATEGORY NG");
        res.json({
            success: false,
            mess: "timeデータが存在しない。またはデータが正しくない"
        })
    }
}

/**
 * version: V1. yearごとのcategoryを取得
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function getLitsCategoryByYearv1(req: Request, res: Response): void
{
    
    const getCategory = categoriesModel.getCategoryByYear();
    if (getCategory) {
        console.log("GET CATEGORY LIST BY YEAR OK");
    } else {
        console.log("GET CATEGORY LIST BY YEAR NG");
    }

    res.json(getCategory);
}

/**
 * version: V2. categoryを保存
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function saveCategoryv2(req: Request, res: Response): void
{
    // 変数宣言
    const reqData = req.body;

    //リクエストデータ確認
    if (categoriesModel.checkReqDataForSave(reqData)) {
        const saveData = categoriesModel.saveC(reqData);
        if (saveData.success) {
            console.log("SAVE CATEGORY OK");
        } else {
            console.log("SAVE CATEGORY NG");
        }

        res.json(saveData);
    } else {
        console.log("SAVE CATEGORY NG");
        res.json({
            success: false,
            mess: "入力データが存在しない。または正しくない。"
        })
    }
}

/**
 * version: V1. categoryを保存
 * * 既存のデータを削除し、選択された年ごとのカテゴリーを保存する
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function saveCategoryByYearv1(req: Request, res: Response): void
{
    // 変数宣言
    const reqData: {caData: any[], time_id: number} = req.body;
    let result: boolean[] = [];
    let messenger: string = "";
    console.log(reqData);
    //リクエストデータ確認
    if ("caData" in reqData && "time_id" in reqData){
        if (reqData.caData instanceof Array) {
        const checkData = reqData.caData.every((val) => categoriesModel.checkReqDataForSave({...val, time_id: reqData.time_id}) === true);
        if (checkData === true) {
            const deleteId = [reqData.caData[0].time_id];
            // 既存データを削除する
            const deleteData = categoriesModel.deleteC(deleteId);
            if (deleteData.success) {
                reqData.caData.map((val: object) => {
                    // 新しいデータを保存する
                    const saveData = categoriesModel.saveC({...val, time_id: reqData.time_id});
                    if (saveData.success) {
                        console.log("SAVE CATEGORY BY YEAR OK");
                    } else {
                        console.log("SAVE CATEGORY BY YEAR NG");
                    }
                    result.push(saveData.success);
                });

                res.json({
                    success: result.every((val) => val === true),
                    mess: messenger
                });
            }
        }

        } else {
            console.log("SAVE CATEGORY NG");
            res.json({
                success: false,
                mess: "入力データが存在しない。または正しくない。"
            })
        }
    } else {
        console.log("SAVE CATEGORY NG");
        res.json({
            success: false,
            mess: "カテゴリーデータが不正な値です。"
        });
    }
}

/**
 * version: V2. categoryを削除
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function deleteCategoryv2(req: Request, res: Response): void
{
    const reqData = req.body;
    
    // リクエストデータ確認
    if (categoriesModel.checkReqDataForDelete(reqData)) {
        const resDelete = categoriesModel.deleteC(reqData.category_ids);

        if (resDelete.success) {
            console.log("DELETE CATEGORY OK");
        } else {
            console.log("DELETE CATEGORY NG");
        }

        res.json(resDelete);
    } else {
        console.log("DELETE CATEGORY NG");
        res.json({
            success: false,
            mess: "削除データが存在しない。または削除データが正しくない。"
        })
    } 

}

/**
 * version: V2. categoryを更新
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function updateCategoryv2(req: Request, res: Response): void
{
    const reqData = req.body;
    
    // リクエストデータ確認
    if (categoriesModel.checkReqDataForUpdate(reqData)) {
        const resUpdate = categoriesModel.updateC(reqData);

        if (resUpdate.success) {
            console.log("UPDATE CATEGORY OK");
        } else {
            console.log("UPDATE CATEGORY NG");
        }

        res.json(resUpdate);
    } else {
        console.log("UPDATE CATEGORY NG");
        res.json({
            success: false,
            mess: "更新データが存在しない。または更新データが正しくない。"
        })
    } 

}

/**
 * version: V2. expensesデータ一覧を取得
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function viewExpensev2(req: Request, res: Response): void
{
    const reqQuery = req.query;

    if (expensesModel.checkReqDataForView(reqQuery)) {
        const getData = expensesModel.viewE(reqQuery.time_id);
        if (getData.success) {
            console.log("GET EXPENSES OK");
        } else{
            console.log("GET EXPENSES NG");
        }
        res.json(getData);
    } else {
        console.log("GET EXPENSES NG");
        res.json({
            success: false,
            mess: "timeデータが存在しない。またはデータが正しくない"
        })
    }
}

/**
 * version: V2. expenses保存
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function saveExpensev2(req: Request, res: Response): void
{
    // 変数宣言
    const reqData = req.body;

    //リクエストデータ確認
    if (expensesModel.checkReqDataForSave(reqData)) {
        const saveData = expensesModel.saveE(reqData);
        if (saveData.success) {
            console.log("SAVE EXPENSE OK");
        } else {
            console.log("SAVE EXPENSE NG");
        }

        res.json(saveData);
    } else {
        console.log("SAVE EXPENSE NG");
        res.json({
            success: false,
            mess: "入力データが存在しない。または正しくない。"
        })
    }

}

/**
 * version: V2. expenseを削除
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function deleteExpensev2(req: Request, res: Response): void
{
    const reqData = req.body;
    
    // リクエストデータ確認
    if (expensesModel.checkReqDataForDelete(reqData)) {
        const resDelete = expensesModel.deleteE(reqData.expense_ids);

        if (resDelete.success) {
            console.log("DELETE EXPENSE OK");
        } else {
            console.log("DELETE EXPENSE NG")
        }

        res.json(resDelete);
    } else {
        console.log("DELETE EXPENSE NG")
        res.json({
            success: false,
            mess: "削除データが存在しない。または削除データが正しくない。"
        })
    } 
}
/**
 * version: V2. expenseを更新
 * * APIから処理要求を処理する
 * @param req 
 * @param res 
 */
export function updateExpensev2(req: Request, res: Response): void
{
    const reqData = req.body;
    
    if (expensesModel.checkReqDataForUpdate(reqData)) {
        const resUpdate = expensesModel.updateE(reqData);

        if (resUpdate.success) {
            console.log("UPDATE EXPENSE OK");
        } else {
            console.log("UPDATE EXPENSE NG")
        }

        res.json(resUpdate);
    } else {
        console.log("UPDATE EXPENSE NG")
        res.json({
            success: false,
            mess: "更新データが存在しない。または更新データが正しくない。"
        })
    } 
}
