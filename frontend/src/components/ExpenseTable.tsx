import { useEffect, useState } from 'react';
import '../css/expensetable.css';
import { handleUpdateExpense, handleGetAllCategory } from '../services/api';

import InputAndP from '../components/InputAndP';
import CategorySelectList from './CategorySelectList';




/**
 * 
 */
type ExpenseTableBody = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    category_id: number;
    category_name: string;
};

type UpdateExpenseTableBody = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    category_id: number;
};

type timeType = {
    time_id: number;
    year: number;
    month: number;
}

type TableProps = {
    title: string[];
    body: ExpenseTableBody[];
    year: number;
    month: number;
    isUpdate: boolean;
    isClickMonth: boolean;
    handleDelete: (ids: number[]) => void;
    handleUpdate: (data: any) => void;
};

type ExpenseTableProps = {
    body: ExpenseTableBody[];
    year: number;
    month: number;
    time: timeType;
    isUpdate: boolean;
    isClickMonth: boolean;
    isCategoryUpdate?: boolean;
    handleDelete: (ids: number[]) => void;
    handleUpdate: (data: any) => void;
};

type categoryDataType = {
    category_id: number;
    category_name: string;
};
/**
 * 
 * @param title 
 * @param body expense table data
 * @param year 年
 * @param month 月
 * @returns 
 */
function ExpenseTable({
    body,
    year,
    month,
    time,
    isClickMonth,
    isUpdate,
    isCategoryUpdate,
    handleDelete,
    handleUpdate
}: ExpenseTableProps){
    const [expenseId, setExpenseID] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [day, setDay] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [money, setMoney] = useState<string>("");
    const [note, setNote] = useState<string>("");
    
    const [categoryData, setCategoryData] = useState<categoryDataType[]>([]);               // category_tableのデータを設定
    const [checkBox, setCheckBox] = useState<number[]>([]);         // Table componentからチェックバックスで選択された値
    
    const [arrId, setArrId] = useState<number>(-1);
    const [isEdit, setIsEdit] = useState<boolean>(false);           // 更新モード
    const [editId, setEditId] = useState<number>(0);
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

    const handleInitial = () => {
        // 更新モードを停止
        setIsEdit(false);
        // 初期化
        setArrId(-1);
        setExpenseID(0);
        setCategoryId(0);
        setDay("");
        setCategory("");
        setMoney("");
        setNote("");
        setIsCheckAll(false);
    }

    /**
     * データ更新処理
     * * データ形成し、親関数を呼び出す
     */
    const Update = () => {
        
        const makeData: UpdateExpenseTableBody = {
            expense_id: expenseId,
            day: parseInt(day),
            category_id: categoryId,
            money: parseInt(money),
            note: note
        };        
        console.log("update", makeData);
        handleUpdate(makeData);
        // handleInitial();
    }

    const Close = () => {
        handleInitial();
    }

    // Tableから選択された値を取得
    const handleGetCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: number = parseInt(e.target.value);

        // cách 2
        setCheckBox((prev) => {
            if (prev.includes(value)) {
                return prev.filter((item) => item !== value);
            } else {
                return [...prev, value];
            }
        })
    }

    /**
     * 全て選択処理
     */
    const handleGetAllCheckBox = () => {

        const maxLength: number = body.length;              // 全てデータの数
        const checkBoxLength: number = checkBox.length;     // 選択されているデータの数
        
        // 全て選択されたら、選択を外す
        if (checkBoxLength >= maxLength) {
            setCheckBox([]);
            setIsCheckAll(false);
        } else {
            const ids: number[] = body.map((val) => val.expense_id);
            setCheckBox(ids);
            setIsCheckAll(true);
        }
    }

    /**
     * buttonとradio buttonの状態切り替え
     * @param param0 
     * @returns 
     */
    const BtnAndCheckBox: React.FC<{id: number, value: number}> = ({id, value}) => {
        return arrId === id && isEdit ?
            <>
                <button type="button" className="expense-update-btn hover-green" onClick={Update}>O</button>
                <button type="button" className="expense-close-update-btn hover-red" onClick={Close}>X</button>
            </> :
            <input
                type="checkbox"
                value={value}
                checked={checkBox.includes(value)}
                onChange={(e) => handleGetCheckBox(e)}
            />
    }

    /**
     * 更新前の選択処理
     * * 選択した行を入力inputへ変換する
     * @param array_id 選択した行の番号
     * @param expense_id 
     * 
     */
    const handleClickForUpdate = (array_id: number, expense_id:number, category_id?: number) => {
        console.log(array_id, expense_id);
        // 更新モードへ変換
        setIsEdit(true);
        // 選択した行の配列の要素番号
        setArrId(array_id);
        // 選択した行のデータを一時的の変数にセットする
        setExpenseID(expense_id);
        setDay(body[array_id].day.toString());
        if (category_id) {
            setCategoryId(category_id);
        }
        // setCategory(body[array_id].category_name);
        setMoney(body[array_id].money.toString());
        setNote(body[array_id].note);

    }  

    /**
     * 選択したカテゴリをセットする
     * @param e 
     */
    const handleChooseCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.target.value;

        setCategory(value.toString());
        setCategoryId(parseInt(value));
    }


    useEffect(() => {
    }, [checkBox]);
    
    useEffect(() => {
        setCheckBox([]);
        handleInitial();
    }, [isUpdate, isClickMonth]);

    useEffect(() => {
        
        const getCategory = handleGetAllCategory(time.time_id);
        getCategory.then((res) => {
            if (res.success && res.data && res.data.length > 0) {
                console.log(res.data);
                setCategoryData(res.data);
            } else {
                setCategoryData([]);
            }
        });

        // 初期化
        handleInitial();
    }, [isClickMonth, isCategoryUpdate]);
    console.log(body);
    return <>
        <div className="create-table">
            <h4>
                {year === 0 ? "" : year}年{month === 0 ? "" : month}月の収入・支出リスト一覧
            </h4> 
            <button type="button" className="" onClick={() => handleDelete(checkBox)}>Delete</button>
            
            <div className="expense-table">
                <div className="table-header">
                    <ul className="table-title">
                        <li><input type="checkbox" onChange={handleGetAllCheckBox} checked={isCheckAll}/></li>
                        <li><p>Day</p></li>
                        <li><p>Category</p></li>
                        <li><p>Money</p></li>
                        <li><p>Note</p></li>
                    </ul>
                </div>
                {body.map((val, index) => (
                    <ul className="table-body" key={index} onDoubleClick={() => handleClickForUpdate(index, val.expense_id, val.category_id)}>
                        <li><BtnAndCheckBox id={index} value={val.expense_id}/></li>
                        <li>
                            <InputAndP
                                id={index}
                                value={arrId === index ? day : val.day.toString()}
                                handleSet={(e) => setDay(e.target.value)}
                                isChange={isEdit && index === arrId}
                            />
                        </li>
                        <li>
                            {/* <InputAndP
                                id={index}
                                value={arrId === index ? category : val.category_name}
                                handleSet={(e) => setCategory(e.target.value)}
                                isChange={isEdit && index === arrId}
                            /> */}
                            {
                                isEdit && index === arrId ? 
                                    <CategorySelectList datas={categoryData} defaultDataId={val.category_id} handleChoose={handleChooseCategory}/>
                                : <p>{val.category_name}</p>
                            }
                        </li>
                        <li>
                            <InputAndP
                                id={index}
                                value={arrId === index ? money : val.money.toString()}
                                handleSet={(e) => setMoney(e.target.value)}
                                isChange={isEdit && index === arrId}
                            />
                        </li>
                        <li>
                            <InputAndP
                                id={index}
                                value={arrId === index ? note : val.note}
                                handleSet={(e) => setNote(e.target.value)}
                                isChange={isEdit && index === arrId}
                            />
                        </li>
                    </ul>   
                ))}
            </div>
        </div>
    </>;
}

export default ExpenseTable;