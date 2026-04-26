import { useEffect, useState } from 'react';


import '../css/mainhome.css'
// Component
import InputData from "./InputData";
import ExpenseTable from './ExpenseTable';
import StatisticsTable from './StatisticsTable';


// api
import { handleGetAllCategory, handleGetAllExpense, handleDeleteExpense, handleUpdateExpense, handleGetStatistics, handleGetStatisticsInOut } from '../services/api';



// ==========type==========
type timeType = {
    time_id: number;
    year: number;
    month: number;
}

type MainHomeProps = {
    props?: boolean;
    isCategoryUpdata?: boolean;         // category_tableのデータ更新状態
    time: timeType;                     // id, year, month
    isClickMonth: boolean;              // タイムの選択状態
    children?: React.ReactNode;
}

// expenseテーブルデータタイプ
type expenseDataType = {
    expense_id: number;
    day: number;
    money: number;
    note: string;
    category_id: number;
    category_name: string;
}

type sumInOutType = {
    sumInCome: number;
    sumPay: number;
}

/**
 * 
 * @param isCategoryUpdata  category_tableのデータ更新状態 
 * @param time id, year, month
 * @function isClickMonth      タイムの選択状態
 * @returns 
 */
function HomeMain({ isCategoryUpdata, time, isClickMonth }: MainHomeProps): React.ReactNode
{
    const [isOpen, setIsOpen] = useState<boolean>(true);                        // サイドバーの状態　true | false
    const [isUpdateData, setIsUpdateData] = useState<boolean>(true);            // DBのデータ更新状態
    const [isShowStatistics, setIsShowStatistics] = useState<boolean>(false);   // statistic表示

    const [expenseData, setExpenseData] = useState<expenseDataType[]>([]);      // expense data
    const [checkBox, setCheckBox] = useState<string[]>([]);                     // Table componentからチェックバックスで選択された値

    const [theadForStatistics, setTheadForStatistics] = useState<string[]>(["Category"]);
    const [statisticsData, setStatisticsData] = useState<string[][]>([]);   // 支出・収入データ一覧
    const [sumInOut, setSumInOut] = useState<sumInOutType>({sumInCome: 0, sumPay: 0});

    // inputdata側で入力成功の場合、expense table更新
    const handleGetIsUpdateState = () => {
        setIsUpdateData(!isUpdateData);
    }

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
                console.log(res.mess);
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

    useEffect(() => {   
            // 支出・収入一覧取得
            // 月のリストを初期化 (1~maxMonth)
            const getData = handleGetStatistics(time.time_id);
            getData.then((res) => {
                if (res.success && res.data) {
                    setStatisticsData(res.data)
                } else {
    
                }
            })

            const getInOut = handleGetStatisticsInOut(time.time_id);
            getInOut.then((res) => {
                if(res.success && res.data) {
                    setSumInOut(res.data);
                    console.log(res.data);
                }
            })
    
        }, [isShowStatistics, isUpdateData]);

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
                    time={time}
                    getIsUpdateData={handleGetIsUpdateState}
                />
            </div>
            <div className="main-body border-1p">
                <h4>
                    {time.year === 0 ? "" : time.year}年{time.month === 0 ? "" : time.month}月の収入・支出リスト一覧
                </h4>
                <p>Show statistics detail: <input type="checkbox" checked={isShowStatistics} onChange={() => setIsShowStatistics(!isShowStatistics)}/></p>
                <div className="main-body-table">
                    <div className="main-body-expense-table">
                        <ExpenseTable
                            body={expenseData}
                            time={time}
                            isUpdate={isUpdateData}
                            isClickMonth={isClickMonth}
                            isCategoryUpdate={isCategoryUpdata}
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                        />
                    </div>
                    <div className={`${isShowStatistics ? "main-body-statics-table" : "main-body-statics-table display-not-show"}`}>
                        <StatisticsTable
                            tHead={["Category", time.month.toString()]}
                            tBody={statisticsData}
                            sumInOut={sumInOut}
                        />
                    </div>
                </div>
            </div>
    
    </>
}

export default HomeMain