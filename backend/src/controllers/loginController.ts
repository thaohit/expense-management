import { Request, Response} from 'express';

import * as loginModel from '../models/loginModel';

/**
 * loginController
 * @param req request フロンエンドからのリクエスト
 * @param res response　フロンエンドへのレスポンス
 * @returns Object
 */
export function login(req:Request, res:Response):object {

    const requestData = req.body;
    let result:boolean = false;

    // console.log(req.body);
    // JSONデータを確認
    if (Object.keys(requestData).length !== 0) {
        const { userName, pass } = requestData;
        // ログイン情報を確認する処理を実行
        if(loginModel.handleCheckLogin(userName, pass)) {
            result = true;
        }
    }
    
    // 結果をJSON形式として返す
    return res.json({success: result});
}

// ユーザーとパスワードをチェック
// app.post("/check-login", (res:Response, req:Request) => {
//     const requestData = req.body;
//     let result:boolean = false;
//     console.log(req.body);
//     // Mình sẽ viết logic kiểm tra thông tin sau
//     if (Object.keys(requestData).length !== 0) {
//         if(loginModel.handleCheckLogin(requestData)) {
//             result = true;
//         }
//     }
//     // 結果をJSON形式として返す
//     res.json({success: result});
// })

// login(Request, Response)




