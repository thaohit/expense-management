import { useEffect, useState } from 'react';


import '../css/mainhome.css'
// Component
import InputData from "./InputData";
import Table from "./Table";

// api
import { handleGetAllCategory, handleGetAllExpense, handleDeleteExpense, handleUpdateExpense } from '../services/api';
import ExpenseTable from './ExpenseTable';

// type
type TableBody = {
    day: string;
    category: string;
    money: number;
    note: string;
}
const titles:string[] =  ["Ngày", "Mục", "Số tiền", "Ghi chú"];
const tableData:TableBody[] = [
    {day: "1", category:"Eat", money: 2000, note: "khong gi"},
    {day: "2", category:"Electronic", money: 3000, note: "Tiền điện"},
    {day: "3", category:"Internet", money: 2400, note: "Tiền internet"},
    {day: "4", category:"Presents", money: 10000, note: "Quà tặng ny"},
    {day: "25", category:"House", money: 30000, note: ""}
];


// ==========type==========
type timeType = {
    time_id: number;
    year: number;
    month: number;
}

type MainHomeProps = {
    props?: boolean;
    isCategoryUpdata?: boolean;         // category_tableのデータ更新状態
    year: number;                       // 年           
    month: number;                      // 月
    time: timeType;                     // id, year, month
    isClickMonth: boolean;              // タイムの選択状態
    children?: React.ReactNode;
}

type categoryDataType = {
    id: number;
    name: string;
}

type expenseDataType = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    category_id: number;
    category_name: string;
}

/**
 * 
 * @param isCategoryUpdata  category_tableのデータ更新状態 
 * @param year 年
 * @param month 月
 * @param time id, year, month
 * @param isClickMonth      タイムの選択状態
 * @returns 
 */
function HomeMain({ isCategoryUpdata, year, month, time, isClickMonth }: MainHomeProps): React.ReactNode
{
    const [isOpen, setIsOpen] = useState<boolean>(true);                        // サイドバーの状態　true | false
    const [isUpdateData, setIsUpdateData] = useState<boolean>(true);            // DBのデータ更新状態

    // const [categoryData, setCategoryData] = useState<categoryDataType[]>([]);
    const [expenseData, setExpenseData] = useState<expenseDataType[]>([]);      // expense data
    const [checkBox, setCheckBox] = useState<string[]>([]);                     // Table componentからチェックバックスで選択された値

    // inputdata側で入力成功の場合、expense table更新
    const handleGetIsUpdateState = () => {
        setIsUpdateData(!isUpdateData);
    }
    // Tableから選択された値を取得
    // const handleGetCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     let value: string = e.target.value;
    //     let checkBoxArr = checkBox;
    //     let arrNum = checkBoxArr.indexOf(value);
    //     if (arrNum === -1) {
    //         checkBoxArr.push(value);
    //     } else {
    //         checkBoxArr.splice(arrNum, 1);
    //     }
        
    //     setExpenseData(expenseData);
    //     setCheckBox(checkBoxArr);

    //     console.log(checkBox);
    // }

    /**
     * expenses 削除処理
     * @param ids expenseId
     */
    const handleDelete = (ids: number[]) => {
        const deleteExpense = handleDeleteExpense(ids);
        deleteExpense.then((res) => {
            // 削除に成功する場合、expenseデータを更新し、render
            if (res.success) {
                setIsUpdateData(!isUpdateData);
            }
            alert(res.mess);
        })
    }

    /**
     * 更新処理
     * @param data expense datas
     */
    const handleUpdate = (data: expenseDataType) => {

        const updateData = handleUpdateExpense(data);
        updateData.then((res) => {
            // 更新に成功する場合、expenseデータを更新し、render
            if (res.success) {
                setIsUpdateData(!isUpdateData);
            }
            alert(res.mess);
        });
    }

    // categoryが更新される場合、データを再取得し、render
    useEffect(() => {
        let ignore = false; // Clear up

        if (ignore === false) {
            const getCategory = handleGetAllCategory(time.time_id);
            getCategory.then((res) => {
                console.log("category", res, year, month);
            })
        }
        return () => {ignore = true};
    }, [isCategoryUpdata]);

    // タイムが更新される場合
    useEffect(() => {
        
    }, [isClickMonth]);

    // Expenseデータ一覧を取得し、反映する
    useEffect(() => {

        const getAllExpense = handleGetAllExpense(time.time_id);
        getAllExpense.then((res) => {
            if (res.success && res.data) {
                setExpenseData([...res.data]);
            } else {
                // setExpenseData([]);
            }
            console.log(res.mess);
        });

        // 初期化
        setCheckBox([]);
    }, [isClickMonth, isUpdateData]);

    return <>
        
            <div className="main-header">
                <div className="main-header-title border-1p">
                    <h1>Home Page</h1>
                </div>
            </div>
            <div className="main-input-data border-1p">
                <InputData 
                    sideBarIsOpen={isOpen}
                    isCategoryUpdate={isCategoryUpdata}
                    isClickMonth={isClickMonth}
                    year={year}
                    month={month}
                    time={time}
                    getIsUpdateData={handleGetIsUpdateState}
                />
            </div>
            <div className="main-body border-1p">
                {/* <Table 
                    title={titles}
                    body={expenseData}
                    year={year}
                    month={month}
                    isUpdate={isUpdateData}
                    isClickMonth={isClickMonth}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                /> */}
                <ExpenseTable
                    body={expenseData}
                    year={year}
                    month={month}
                    time={time}
                    isUpdate={isUpdateData}
                    isClickMonth={isClickMonth}
                    isCategoryUpdate={isCategoryUpdata}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                />
            </div>
    
    </>
}

export default HomeMain