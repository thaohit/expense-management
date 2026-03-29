/*
APIについての処理

*/



type apiResultType<T> = {
    success?: boolean;
    data?: T;
    mess?: string;
};
// ==========YEAR==========
type yearDbType = {
    year_id: number;
    year_name: number;
}
// ==========TIME==========
type timeDbType = {
    time_id: number;
    year: number;
    month: number;
}

type timeSaveDbType = {
    year: number;
    month: number;
}
// ==========CATEGORY==========
type categoryTableGetAllType = {
    category_id: number;
    category_name: string;
}

type categoryTableSaveType = {
    id: bigint | number;
}

type categoryTableUpdateType = {
    change_num: number;
}

// ==========EXPENSE==========
type expenseTableSaveType = {
    id: bigint | number;
}

type expenseTableGetAllType = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    category_id: number;
    category_name: string;
}

type expenseTableUpdateType = {
    change_num: number;
}

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

/**
 * year_tableの全データ取得を要求
 * @returns 
 */
export async function handleGetAllYear(): Promise<apiResultType<yearDbType[]>>
{    
    try {
        const apiRes = await fetch("http://localhost:3000/home/api/v1/all-year", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!apiRes.ok) {
            throw new Error(`HTTP error ${apiRes.status}`);
        }
        // console.log(apiRes);
        return apiRes.json();

    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            }
        }

        return {
            success: false,
            mess: ""
        };
    }
}

/**
 * year_table保存を要求
 * @param year 
 * @returns 
 */
export async function handleSaveYear(year: number): Promise<apiResultType<number[]>>
{

    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/year?addY=${year}`,  {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!apiRes.ok) {
            throw new Error (`HTTP error ${apiRes.status}`);
        }

        return apiRes.json();

    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: ""
        }
    }
}

/**
 * year_tabelのデータ削除を要求
 * @param year_ids string[]
 * @returns 
 */
export async function handleDeleteYear(year_ids: number[]): Promise<apiResultType<number[]>>
{
    if (year_ids.length > 0) {
        try {
            const apiRes = await fetch("http://localhost:3000/home/api/v1/year", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(year_ids)
            });
    
            if (!apiRes.ok) {
                throw new Error(`HTTP error ${apiRes.status}`);
            }
    
            return apiRes.json();
        } catch (error) {
            if (error instanceof Error) {
                return { 
                    success: false,
                    mess: error.message
                }
            }
    
            return {
                success: false,
                mess: ""
            }
        }
    }

    return {
        success: false,
        mess: "There is not data for handle"
    }
}

/**
 * times_tableの全データ取得を要求
 * @param year 
 * @returns 
 */
export async function handleGetAllTime(year: number): Promise<apiResultType<timeDbType[]>>
{
    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/time?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!apiRes.ok) {
            throw new Error (`HTTP error ${apiRes.status}`);
        }

        return apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: ""
        };
    }
}

/**
 * time_table保存処理を要求
 * @param yearAndMonth 
 * @returns 
 */
export async function handleSaveTime(yearAndMonth: timeSaveDbType): Promise<apiResultType<timeDbType[]>>
{
    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/time`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(yearAndMonth)
        });
        
        if (!apiRes.ok) {
            throw new Error(`HTTP error ${apiRes.status}`);
        }

        return apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            }
        }

        return {
            success: false,
            mess: ""
        };
    }
}

/**
 * times_tableのデータ削除を要求
 * @param time_ids 
 * @returns 
 */
export async function handleDeleteTime(time_ids: number[]): Promise<apiResultType<timeDbType>>
{

    try {
        const apiRes = await fetch("http://localhost:3000/home/api/v1/time", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(time_ids)
        });

        if (!apiRes.ok) {
            throw new Error(`HTTP error ${apiRes.status}`);
        }
        
        return apiRes.json()
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            }
        }
        return {
            success: false,
            mess: "Unknow Error"
        }
    }
}

/**
 * category_tableの全データ取得を要求
 * @param mod   0: 全部取得、1: 部分一取得
 * @param m     月
 * @param y     年
 * @returns 
 */
export async function handleGetAllCategory(
    mod: number = 0,
    y: number = 0,
    m: number = 0
): Promise<apiResultType<categoryTableGetAllType[]>>
{       
    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/category?mode=${mod}&year=${y}&month=${m}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!apiRes.ok) {
            throw new Error(`HTTP error ${apiRes.status}`);
        }
        return  apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            }
        }

        return{
            success: false,
            mess: ""
        }
    }
}

/**
 * category_tableデータ保存を要求
 * @param data 
 * @returns 
 */
export async function handleSaveCategory(data: object): Promise<apiResultType<categoryTableSaveType>>
{   
    try {
        const apiRes = await fetch("http://localhost:3000/home/api/v1/category", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (!apiRes.ok) {
            throw new Error(`HTTP error ${apiRes.status}`);
        }

        return  apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            }
        }

        return{
            success: false,
            mess: ""
        }
    }
}

/**
 * category_table更新を要求
 * @param id category_id
 * @param name category_name
 * @returns 
 */
export async function handleUpdateCategory(id: number, name: string): Promise<apiResultType<categoryTableUpdateType>>
{   
    const makeJsonData = {
        category_id: id,
        category_name: name
    };

    try {
        const apiRes = await fetch("http://localhost:3000/home/api/v1/category", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(makeJsonData)
        })

        if (!apiRes.ok) {
            throw new Error(`HTTP error ${apiRes.status}`);
        }
        return  apiRes.json();

    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            }
        }

        return{
            success: false,
            mess: ""
        }
    }
}

/**
 * category_tableのデータ削除を要求
 * @param category_id
 * @returns 
 */
export async function handleDeleteCategory(category_id: string[]): Promise<apiResultType<categoryTableUpdateType>>
{   
    try {
        const apiRes = await fetch("http://localhost:3000/home/api/v1/category", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category_id)
        })

        if (!apiRes.ok) {
            throw new Error(`HTTP error ${apiRes.status}`);
        }
        return  apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            }
        }

        return{
            success: false,
            mess: ""
        }
    }
}

/**
 * expense_table保存を要求
 * @param data [day]
 */
export async function handleSaveExpense(data: string[]): Promise<apiResultType<expenseTableSaveType>>
{
    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/expense`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!apiRes.ok) {
            throw new Error (`HTTP error ${apiRes.status}`);
        }

        return apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: "Unknow error"
        };
    }
}

/**
 * expense tableデータの一覧取得を要求
 * @param time_id 
 */
export async function handleGetAllExpense(time_id: string): Promise<apiResultType<expenseTableGetAllType[]>>
{
    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/expense?time_id=${time_id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!apiRes.ok) {
            throw new Error (`HTTP error ${apiRes.status}`);
        }

        return apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        
        return {
            success: false,
            mess: "Unknow error"
        };
    }
}

/**
 * expense tableデータ更新を要求
 * @param data expenseid, day, category_id, money, month 
 */
export async function handleUpdateExpense(data: expenseTableGetAllType): Promise<apiResultType<expenseTableUpdateType>>
{
    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/expense`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!apiRes.ok) {
            throw new Error (`HTTP error ${apiRes.status}`);
        }

        return apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: "Unknow Error"
        }
    }
}

/**
 * expense tableデータ削除を要求
 * @param data expenseid, day, category_id, money, month 
 */
export async function handleDeleteExpense(expense_id: number[]): Promise<apiResultType<expenseTableUpdateType>>
{
    try {
        const apiRes = await fetch(`http://localhost:3000/home/api/v1/expense`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense_id)
        });

        if (!apiRes.ok) {
            throw new Error (`HTTP error ${apiRes.status}`);
        }

        return apiRes.json();
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                mess: error.message
            };
        }

        return {
            success: false,
            mess: "Unknow Error"
        }
    }
}