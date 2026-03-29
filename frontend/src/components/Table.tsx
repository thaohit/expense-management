import { useEffect, useState } from 'react';
import '../css/table.css';
import { handleDeleteExpense } from '../services/api';



/**
 * 
 */
type TableBody = {
    expense_id: number;
    day: number;
    category_name: string;
    money: number;
    note: string;
};

type TableProps = {
    title: string[];
    body: TableBody[];
    year: number;
    month: number;
    isUpdate: boolean;
    isClickMonth: boolean;
    handleDelete: (ids: number[]) => void;
    handleUpdate: (data: any) => void;
};


/**
 * 
 * @param title 
 * @param body expense table data
 * @param year 年
 * @param month 月
 * @returns 
 */
function Table({
    title = [],
    body = [],
    year, month,
    isUpdate,
    isClickMonth,
    handleDelete,
    handleUpdate
}:TableProps)
{
    const [day, setDay] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [money, setMoney] = useState<string>("");
    const [note, setNote] = useState<string>("");
    
    const [checkBox, setCheckBox] = useState<number[]>([]);                     // Table componentからチェックバックスで選択された値
    
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [editId, setEditId] = useState<number>(0);

    // Tableから選択された値を取得
    const handleGetCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: number = parseInt(e.target.value);
        // let checkBoxArr = checkBox;
        // let arrNum = checkBoxArr.indexOf(value);
        // if (arrNum === -1) {
        //     checkBoxArr.push(value);
        // } else {
        //     checkBoxArr.splice(arrNum, 1);
        // }
        
        // setCheckBox([...checkBoxArr]);

        // cách 2
        setCheckBox((prev) => {
            if (prev.includes(value)) {
                return prev.filter((item) => item !== value);
            } else {
                return [...prev, value];
            }
        })
    }

    const handleClickForUpdate = (expense_id: number) => {
        setIsEdit(!isEdit);
        console.log(expense_id);
    }
    
    useEffect(() => {
        setCheckBox([]);
        console.log(checkBox);
    }, [isUpdate, isClickMonth]);
    return <>
        <div className="create-table">
            <h4>
                {year === 0 ? "" : year}年{month === 0 ? "" : month}月の収入・支出リスト一覧
            </h4> 
            <button type="button" onClick={() => handleDelete(checkBox)}>Delete</button>
            <button type="button" onClick={() => handleUpdate(checkBox)}>Update</button>
            <table border={1}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Day</th>
                        <th>Category</th>
                        <th>Money</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {// sua table tr td -> ul li input
                    }
                    {body.length > 0 ?
                        body.map((value:TableBody, index:number) => (
                            <tr key={index} onDoubleClick={() => handleClickForUpdate(value.expense_id)}>
                                <td >
                                    <input type="checkbox"
                                        value={value.expense_id}
                                        checked={checkBox.includes(value.expense_id)}
                                        onChange={(e) => handleGetCheckBox(e)}
                                    />
                                </td>
                                {
                                    isEdit && editId === value.expense_id ?
                                    <>
                                        <td>{value.day}</td>
                                        <td>{value.category_name}</td>
                                        <td>{value.money}</td>
                                        <td>{value.note}</td>
                                    </>
                                    : 
                                    <>
                                        <td><input type="text" value={value.day}/></td>
                                        <td><input type="text" value={value.category_name}/></td>
                                        <td><input type="text" value={value.money}/></td>
                                        <td><input type="text" value={value.note}/></td>
                                    </>
                                }
                            </tr>
                        )) : null
                    }
                </tbody>
            </table>
        </div>
    </>;
}

export default Table;