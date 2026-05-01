import Database from "better-sqlite3";
import path, { join } from "path";

const dbPath = path.resolve(__dirname, '../db', 'maindb.db');
const db = new Database(dbPath);

type getType = {
    fields?: string[];
    join?: {
        joinTable: string,
        fieldsJoin?: string[];
        on: {source: string, target: string}[],
        joinType: "INNER JOIN" | "LEFT JOIN" | "RIGHT JOIN"
    }[];
    where?: {fields: string[], values: any[], connection?: "AND" | "OR"};
    // whereIn?: {field: string, values: any[]};
    whereIn?: {fields: string[], values: any[][], connection?: "AND" | "OR"};
    orderBy?: {field: string, direction?: "ASC" | "DESC"};
    isWriteField?: boolean;
}

type getAllType = {
    fields?: string[];
    join?: {
        joinTable: string,
        fieldsJoin?: string[];
        on: {source: string, target: string}[],
        joinType: "INNER JOIN" | "LEFT JOIN" | "RIGHT JOIN"
    }[];
    where?: {fields: string[], values: any[], connection?: "AND" | "OR"};
    whereIn?: {fields: string[], values: any[][], connection?: "AND" | "OR"};
    orderBy?: {field: string, direction?: "ASC" | "DESC"}[];
    groupBy?: {fields: string[]};
    run?: boolean;
    isWriteField?: boolean;
}

type saveType = {
    values?: any[];
}

type updateType = {
    fieldAndValue: {fields: string[], values: any[]};
    where: {field: string, value: any};
}

type deleteType = {
    where?: {fields: string[], values: any[]};
    whereIn?: {field: string, values: any[]};
}

type hanldeResultType = {
    success: boolean;
    data?: any;
    mess: string;
}

function makePlaceholders(params: any[]): string
{
    return "";
}

export class AppTable {

    tableName: string;

    constructor(name: string) {
        this.tableName = name;
    }
    
    /**
     * 1つデータ取得
     * @param fields フィルド
     * @param where WHERE文
     * @param whereIn WHERE IN文
     * @param orderBy ORDER BY文
     * @param isWriteField WHERE文を手動で書く
     * @returns 
     */
    get({fields, join, where, whereIn, orderBy, isWriteField}: getType): hanldeResultType
    {
        if (where && whereIn) {
            return {
                success: false,
                mess: "Cannot use where and whereIn inside a sql"
            };
        }

        // QUERY
        let query: string = `SELECT ${fields?.join(", ") || "*"} FROM ${this.tableName} `;
        let query2 = "";
        let query3 = "";
        let params: any[] = [];

        // JOIN
        if (join) {
            if (!isWriteField) {
                query = `SELECT ${fields?.map((val) => `${this.tableName}.${val}`).join(", ") || ""}`;
                query2 = join.map((val) => {
                    if (val.fieldsJoin) {
                        return `, ${val.fieldsJoin.map((valF) => `${val.joinTable}.${valF}`).join(", ")}`;
                    }
                }).join("");
            } else {
                query = `SELECT ${fields?.map((val) => val).join(", ") || `SELECT ${this.tableName}.*`}`;
            }

            query2 += ` FROM ${this.tableName}`;
            query3 = join.map((val) => {
                return ` ${val.joinType} ${val.joinTable} ON ${val.on.map((valOn) => `${this.tableName}.${valOn.source} = ${val.joinTable}.${valOn.target}`).join(" ")}`;
            }).join("");
            
            query += query2;
            query += query3;
        } else {
        }

        // WHERE
        if (where) {
            if (where.connection && where.fields.length <= 1) {
                return {
                    success: false,
                    mess: "Cannot use connection if where's field is less then 1"
                }
            } else if (!where.connection && where.fields.length > 1) {
                return {
                    success: false,
                    mess: "Cannot use connection if while field is less then 1"
                }
            } 
            let condition = ` WHERE ${where.fields?.map((val) => `${val} = ?`)}`;
            if (where.connection) {
                condition = ` WHERE ${where.fields?.map((val) => `${val} = ? `).join(`${where.connection} `)}`;
            }
            params = where.values;
            query += condition;            
        } 
        // WHERE IN
        else if (whereIn) {
            // const placeholders = whereIn.values.map(() => "?").join(", ");
            // params.push(...whereIn.values)
            // query += ` WHERE IN ${whereIn.field} (${placeholders})`;
            let whereInQuery = ` WHERE ${whereIn.fields[0]} IN (${whereIn.values[0]?.map((val) => "?").join(", ")})`
            let whereInValues = [];
            for (let value of whereIn.values) {
                whereInValues.push(...value);
            }
            if (whereIn.connection) {
                whereInQuery = ` WHERE ${whereIn.fields.map((val, num) => {
                    let placeholder = whereIn.values[num]?.map((item) => "?").join(", ");
                    let wherein = `${val} IN (${placeholder})`;
                    return wherein;
                }).join(` ${whereIn.connection} `)}`;
            }
            query += whereInQuery;
            params = whereInValues;
        }

        // ORDER BY
        if (orderBy) {
            query += ` ORDER BY ${orderBy.field} ${orderBy.direction || "ASC"}`;
        }

        try {
            const result = db.prepare(query).get(params);
            return {
                success: true,
                data: result,
                mess: "GET DATA OK"
            };     
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
     * 全て取得
     * @param fields フィルド
     * @param join JOIN
     * @param where WHERE文
     * @param whereIn WHERE IN文
     * @param orderBy ORDER BY文
     * @param groupBy GROUP BY文
     * @param isWriteField WHERE文を手動で書く
     * @param run boolean クエリ実行するか？
     * @returns 
     */
    getAll({fields, join, where, whereIn, orderBy, groupBy, run = true, isWriteField = false}: getAllType): hanldeResultType
    {

        if (where && whereIn) {
            return {
                success: false,
                mess: "Cannot use where and whereIn inside a sql"
            };
        }
        // QUERY
        let query: string = `SELECT ${fields?.join(", ") || "*"} FROM ${this.tableName} `;
        let query2 = "";
        let query3 = "";
        // JOIN
        if (join) {
            if (!isWriteField) {
                query = `SELECT ${fields?.map((val) => `${this.tableName}.${val}`).join(", ") || ""}`;
                query2 = join.map((val) => {
                    if (val.fieldsJoin) {
                        return `, ${val.fieldsJoin.map((valF) => `${val.joinTable}.${valF}`).join(", ")}`;
                    }
                }).join("");
            } else {
                query = `SELECT ${fields?.map((val) => val).join(", ") || `SELECT ${this.tableName}.*`}`;
            }

            query2 += ` FROM ${this.tableName}`;
            query3 = join.map((val) => {
                return ` ${val.joinType} ${val.joinTable} ON ${val.on.map((valOn) => `${this.tableName}.${valOn.source} = ${val.joinTable}.${valOn.target}`).join(" ")}`;
            }).join("");
            
            query += query2;
            query += query3;

            // query = `SELECT ${fields?.map((val) => `${this.tableName}.${val}`).join(", ")}, `;
            // if (val.fieldsJoin && fields) {
            // query += `${join.map((val) => `${val.joinTable}.${val.fieldsJoin}`).join(", ")} FROM ${this.tableName}`;
            // query += ``
            // query = join.map((val) => {
            //     if (val.fieldsJoin && fields) {

            //     }
            //     return "";
            // })
            // if (fieldsJoin && fields) {
            //     query = `SELECT ${fields.map((val) => `${this.tableName}.${val}`).join(", ")}, `
            //     query += `${join.map((val) => `${val.fieldsJoin}`)} FROM ${this.tableName}`;

            //     query += `${fieldsJoin?.map((val) => `${join.joinTable}.${val}`)} FROM ${this.tableName}`;
            // }
            // else if (fieldsJoin || fields) {
            //     query = `SELECT ${fields?.map((val) => `${this.tableName}.${val}`).join(", ") || ""}${fieldsJoin?.map((val) => `${join.joinTable}.${val}`) || ""} FROM ${this.tableName}`;
            // }

            // if (join.joinType) {

            // } else {
            //     query += ` INNER JOIN ${join.joinTable} ON ${join.field.map((val) => `${this.tableName}.${val.source} = ${join.joinTable}.${val.target}`).join(", ")}`
            // }

            // if (fieldsJoin && fields) {
            //     query = `SELECT ${fields.map((val) => `${this.tableName}.${val}`).join(", ")}, `
            //     query += `${join.map((val) => `${val.fieldsJoin}`)} FROM ${this.tableName}`;

            //     query += `${fieldsJoin?.map((val) => `${join.joinTable}.${val}`)} FROM ${this.tableName}`;
            // }

            // query += ` INNER JOIN ${join.joinTable} ON ${join.field.map((val) => `${this.tableName}.${val.source} = ${join.joinTable}.${val.target}`).join(", ")}`

            // else if (fieldsJoin || fields) {
            //     query = `SELECT ${fields?.map((val) => `${this.tableName}.${val}`).join(", ") || ""}${fieldsJoin?.map((val) => `${join.joinTable}.${val}`) || ""} FROM ${this.tableName}`;
            // }
        }
        
        let params: any[] = [];

        // WHERE
        if (where) {
            // if (join && fields) {
            //     query += ` WHERE ${this.tableName}.${where.field} = ?`;
            // } else {
            //     query += ` WHERE ${where.field} = ?`;
            // }
            // params.push(where.value);
            if (where.connection && where.fields.length <= 1) {
                return {
                    success: false,
                    mess: "Cannot use connection if where's field is less then 1"
                }
            } else if (!where.connection && where.fields.length > 1) {
                return {
                    success: false,
                    mess: "Cannot use connection if while field is less then 1"
                }
            } 
            let condition = ` WHERE ${where.fields?.map((val) => `${val} = ?`)}`;
            if (where.connection) {
                condition = ` WHERE ${where.fields?.map((val) => `${val} = ? `).join(`${where.connection} `)}`;
            }
            params = where.values;
            query += condition; 
        }
        // WHERE IN
        else if (whereIn) {

            if (whereIn.connection && whereIn.fields.length <= 1) {
                return {
                    success: false,
                    mess: "Cannot use connection if whereIn's field is less then 1"
                }
            } else if (!whereIn.connection && whereIn.fields.length > 1) {
                return {
                    success: false,
                    mess: "Cannot use connection if while field is less then 1"
                }
            }

            let whereInQuery = ` WHERE ${whereIn.fields[0]} IN (${whereIn.values[0]?.map((val) => "?").join(", ")})`
            let whereInValues = [];
            for (let value of whereIn.values) {
                whereInValues.push(...value);
            }
            if (whereIn.connection) {
                whereInQuery = ` WHERE ${whereIn.fields.map((val, num) => {
                    let placeholder = whereIn.values[num]?.map((item) => "?").join(", ");
                    let wherein = `${val} IN (${placeholder})`;
                    return wherein;
                }).join(` ${whereIn.connection} `)}`;
            }
            query += whereInQuery;
            params = whereInValues;
        }
        // ORDER BY
        // GROUP BY
        if (groupBy) {
            query += ` GROUP BY ${groupBy.fields.map((val) => val).join(", ")}`;
        }

        if (orderBy) {
            // query += ` ORDER BY ${orderBy.field} ${orderBy.direction || "ASC"}`;
            query += ` ORDER BY ${orderBy.map((val) => `${val.field} ${val.direction || "ASC"}`).join(", ")}`;
        }


        if (run === true) {
            // SQL実行
            try {
                const result = db.prepare(query).all(params);
                return {
                    success: true,
                    data: result,
                    mess: "GET DATA OK"
                };     
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
        } else {
            console.log(query);
            return {
                success: true,
                data: query,
                mess: "GET QUERY"
            }
        }

    }

    /**
     * テーブルに保存する処理
     * @param values any[] 保存データ 
     * @returns 
     */
    save({values}: saveType)
    {
        let placeholders = values?.map(() => "?").join(", ");
        let query = `INSERT INTO ${this.tableName} VALUES(null, ${placeholders})`;
        try {
            const result = db.prepare(query).run(values);
            return {
                success: true,
                data: result.lastInsertRowid,
                mess: "SAVE DATA OK"
            }
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
     * データ更新処理
     * @param fieldAndValue columnと値
     * @param where 条件
     * @returns 
     */
    update({fieldAndValue, where}: updateType): hanldeResultType
    {
        let query = `UPDATE ${this.tableName} SET `;
        let params: any[] = [];
        if (fieldAndValue) {
            query += fieldAndValue.fields.map((val) => `${val} = ?`).join(", ");
            params = fieldAndValue.values;
        }

        // WHERE
        if (where) {
            query += ` WHERE ${where.field} = ?`
            params.push(where.value);
        }
        // SQL実行
        try {
            const result = db.prepare(query).run(params);

            return {
                success: true,
                data: result.changes,
                mess: "UPDATE OK"
            }
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
     * データ削除処理
     * @param where WHERE文 {fields, values}
     * @param whereIn WHERE IN文 {fields, values}
     * @returns 
     */
    delete({where, whereIn}: deleteType): hanldeResultType
    {
        if (where && whereIn) {
            return {
                success: false,
                mess: "Cannot use where and whereIn inside a sql"
            };
        }
        let query = `DELETE FROM ${this.tableName}`;
        let params: any[] = [];
        
        // WHERE
        if (where) {
            query += ` WHERE ${where.fields.map((val) => `${val} = ?`).join(", ")}`;
            params = where.values;
        }

        // WHERE IN
        if (whereIn) {
            query += ` WHERE ${whereIn.field} IN (${whereIn.values.map(() => "?").join(", ")})`;
            params = [...params, ...whereIn.values]
        }

         // SQL実行
        try {
            const result = db.prepare(query).run(params);

            return {
                success: true,
                data: result.changes,
                mess: "DELETE OK"
            }
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

}




