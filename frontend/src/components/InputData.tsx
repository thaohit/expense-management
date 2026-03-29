
import '../css/inputdata.css';
import { useEffect, useState } from 'react';

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import BtnIcon from './BtnIcon';
import Table from '../components/Table';
import CategoryTable from './CategoryTable';

// api
import { handleGetAllCategory, handleSaveExpense } from '../services/api';



// ==========type==========
type categoryDataType = {
    category_id: number;
    category_name: string;
};

type InputDataType = {
    title: string[];
    data: string[];
}

type timeType = {
    time_id: number;
    year: number;
    month: number;
}

// 
type inputDataProps = {
    sideBarIsOpen: boolean;             // sideBar開閉状態
    isCategoryUpdate?: boolean;         // category table更新状態
    isClickMonth: boolean;              // time選択状態
    year: number;                       // 年
    month: number;                      // 月
    time: timeType;
    getIsUpdateData: () => void;        // expenseデータ更新状態を取得
}

/**
 * 
 * @param sideBarIsOpen sideBar開閉状態
 * @param isCategoryUpdate category table更新状態
 * @param isClickMonth time選択状態
 * @param year 年
 * @param month 月
 * @param time id year month
 * @param getIsUpdateData expenseデータ更新状態を取得
 * @returns 
 */
function InputData({
    sideBarIsOpen = true,
    isCategoryUpdate,
    isClickMonth,
    year,
    month,
    time,
    getIsUpdateData
}: inputDataProps) 
{
    // 表示用
    const [day, setDay] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [money, setMoney] = useState<string>("");
    const [note, setNote] = useState<string>("");

    // inputのplaceholdel設定
    const [placehol, setPlacehol] = useState<string[]>(
        [
            "",
            "Input number (no) from category table",
            "",
            "",
            "Enter to next input!"
        ]
    );
    const [inputTitle, setInputTitle] = useState<string[]>(["Ngày", "Mục", "Số tiền", "Ghi chú", ""]);
    const [inputDataArray, setInputDataArray] = useState<string[]>(["", "", "", ""]);

    const [isOpen, setIsOpen] = useState<boolean>(true);                                    // inputData開閉状態
    
    const [countInput, setCountInput] = useState<number>(0);                                // 入力番目
    const [inputData, setInputData] = useState<string>("");                                 // データ入力

    const [categoryData, setCategoryData] = useState<categoryDataType[]>([]);               // category_tableのデータを設定

    /**
     * expenseデータ保存処理
     */
    const handleSaveInputData = () => {
        console.log([...inputDataArray, time.time_id.toString()]);

        const saveExpense = handleSaveExpense([...inputDataArray, time.time_id.toString()]);
        saveExpense.then((res) => {
            console.log(res);
            if (res.success && res.data && res.data.id !== 0) {
                // expense table更新された場合、状態更新
                getIsUpdateData();
                handleInitial();

            }
        })
    }

    const handleInputData = () => {
        
    }


    // 初期化処理
    const handleInitial = () => {

        setCountInput(0);
        setInputDataArray(["", "", "", ""]);
        setInputData("");

        // 表示用初期化
        setDay("");
        setCategory("");
        setMoney("");
        setNote("")
    }
    const handleReturnData = () => {

        if (countInput > 0) {

            // 表示用
            switch (countInput) {
                case 0:
                    setDay("");
                    break;
                case 1:
                    setCategory("");
                    break;
                case 2:
                    setMoney("");
                    break;
                case 3:
                    setNote("")
                    break;
            }

            let arrayData: string[] = inputDataArray;
            let count = countInput;
            arrayData[count] = "";
            
            setInputData(arrayData[count - 1]);
            setInputDataArray(arrayData);
            setCountInput(countInput-1);
        } 
    }

    /**
     * 
     * @param event 
     */
    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        // enter keyを押下する時、入力データを取得
        if (event.key === 'Enter') {
            // 入力するタイムを選択しない場合、入力させない
            if (year === 0 && month === 0) {
                alert("Select your time you want to input!!")
                setInputData("");
                return;
            }
            if (inputData === "" && countInput < 3) {
                alert("Input your data!");
                return;
            }

            console.log(categoryData);
            // 表示用
            switch (countInput) {
                case 0:
                    setDay(inputData);
                    break;
                case 1:
                    // 入力したデータと該当カテゴリデータ確認
                    if (!categoryData[parseInt(inputData) - 1]) {
                        alert("there is not category data");
                        return;
                    }
                    setCategory(categoryData[parseInt(inputData) - 1].category_name);
                    break;
                case 2:
                    setMoney(inputData);
                    break;
                case 3:
                    setNote(inputData)
                    break;
            }
            if (countInput < 4) {

                // 保存用の配列を作成
                let arrayData: string[] = inputDataArray;
                
                // category選択の場合、category名で保存する
                if (countInput === 1) {
                    arrayData[countInput] = categoryData[parseInt(inputData) - 1].category_id.toString();
                } else {
                    arrayData[countInput] = inputData;
                }
                
                // 入力を格納
                setInputDataArray(arrayData);
                // 次の項目へ移し、inputを初期化
                setCountInput(countInput+1);
                setInputData("");
                
                // 入力後、expenseを保存し、countInputとinputDataArrayを初期化
            } else if (countInput < 5) {
                // setCountInput(countInput+1);
                handleSaveInputData();
                setCountInput(0);
                setInputDataArray(["", "", "", ""]);
            }
            console.log(inputDataArray);
        }
    }
    
    useEffect(() => {
        
        const getCategory = handleGetAllCategory(1, year, month);
        getCategory.then((res) => {
            if (res.success && res.data && res.data.length > 0) {
                setCategoryData(res.data);
            } else {
                setCategoryData([]);
            }
        });
        // 初期化
        handleInitial();
    }, [isClickMonth, isCategoryUpdate])
    
    console.log("input data");
    return <>
        <div className={`input-data-body${isOpen ? "" : " body-close"}`}>
            <div className="input-data-show border-1p">
                <span className="input-data-show-box">Mục đã nhập </span>
                <div className="input-data-show-day input-data-show-box">
                    <span className={`day-box ${day !== "" ? "font-bold" : ""}`}>Ngày </span>
                    <span>{day}</span>
                </div>
                <div className="input-data-show-category input-data-show-box">
                    <span className={category !== "" ? "category-box font-bold": "category-box"}>Mục </span>
                    <span>{category}</span>
                </div>
                <div className="input-data-show-money input-data-show-box">
                    <span className={money !== "" ? "money-box font-bold": "money-box"}>Số tiền </span>
                    <span>{money}</span>
                </div>
                <div className="input-data-show-note input-data-show-box">
                    <span className={note !== "" ? "note-box font-bold": "note-box"}>Ghi chú </span>
                    <span>{note}</span>
                </div>
                {/* {inputTitle.map((val, index) => (
                    <div className="input-data-show-box" key={index}>
                        <span className={note !== "" ? "note-box font-bold": "note-box"}>{val} </span>
                        <span>{inputDataArray[index]}</span>
                    </div>
                ))} */}
            </div>
            <div className="input-data-handle border-1p">
                <div className="input-data-handle-category">
                    <span>{inputTitle[countInput]}</span>
                </div>
                <div className="input-data-handle-box">
                    <input 
                        type="text"
                        name="input-box"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        onKeyDown={handleEnterKeyDown}
                        placeholder={placehol[countInput]}
                        maxLength={30}
                        style={{height: "20px", width:"100%"}}
                    >
                    </input>
                    {
                        countInput === 1 && isOpen ?
                            <CategoryTable 
                                body={categoryData}
                            /> : 
                            []
                    }
                </div>
                <div className="input-data-handle-btn btn-icon">
                    <span onClick={handleReturnData}><ArrowCircleLeftIcon /></span>
                    <span><ArrowCircleRightIcon /></span>
                </div>
            </div>
        </div>
        <div className="hidden-btn" onClick={() => setIsOpen(!isOpen)}>
                <span className={`icon${isOpen ? "" : " rotate"}`}><KeyboardDoubleArrowUpIcon /></span>
        </div>
    </>;
}


export default InputData;