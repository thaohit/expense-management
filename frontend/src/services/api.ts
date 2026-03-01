/*
APIについての処理

*/

/** 
 * データをバックエンドへPOSTし、確認
 * @param params ユーザーIDとPWを含めるオブジェクト { userName, pw}
 * @return result 確認結果  boolean 
*/
export async function handlePostDataLogin(params: {}): Promise<boolean> {
    let result: boolean = false;
    console.log(params);
    try {
        // API送信
        const res = await fetch("http://localhost:3000/check-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        if(!res.ok) {
            throw new Error (`HTTP error: ${res.status}`);
        }
        const data = await res.json();
        result = data.success;
    } catch (error:any) {
        console.error(error);
    }

    return result;
}

/**
 * 新規ユーザー登録処理
 * @param params 
 * @returns 
 */
export async function hanldePostDataRegister(params:object):Promise<object> {

    let result: object = {};

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        
        if(!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
        }
        result = res.json();
        
    } catch (error: any) {
        return {
            success: false,
            mess: error.message   
        };
    }

    return result;
}