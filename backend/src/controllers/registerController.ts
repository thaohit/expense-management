import { Request, Response } from "express";
import { saveData } from "../config/loginTable";
import { handleSaveData } from "../models/registerModel";
/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export function register (req: Request, res: Response): void
{
    let result: object = {};
    const requestData = req.body;

    // JSONデータを確認
    if (Object.keys(requestData).length > 0) {
        const { userName, pass} = requestData;
        // 保存
        result = handleSaveData(userName, pass);
        console.log(result);
    }
    
    res.json(result);
}