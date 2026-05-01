/**
 * 支出・収入のデータ入力エリア
 */

import { useEffect, useState } from 'react';
import '../css/inputdata.css';

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

// Component
import CategoryTable from './CategoryTable';

// api
import { handleGetAllCategory, handleSaveExpense } from '../services/api';


// ==========type==========
type categoryDataType = {
    category_id: number;
    category_name: string;
    category_type: number;
    display: number;
    priority: number;
    note: string;
};

type timeType = {
    time_id: number;
    year: number;
    month: number;
}

type saveDataType = {
    day: number;
    category_id: number;
    money: number;
    note: string;
    time_id: number;
}

// 
type inputDataProps = {
    sideBarIsOpen: boolean;             // sideBar開閉状態
    isCategoryUpdate?: boolean;         // category table更新状態
    isClickDropdown: boolean;              // time選択状態
    time: timeType;                     // timeテーブルデータ
    getIsUpdateData: () => void;        // expenseデータ更新状態を取得
}

/**
 * 
 * @param sideBarIsOpen sideBar開閉状態
 * @param isCategoryUpdate category table更新状態
 * @param isClickDropdown time選択状態
 * @param time id year month
 * @function getIsUpdateData expenseデータ更新状態を取得
 * @returns 
 */
function InputData({
    sideBarIsOpen = true,
    isCategoryUpdate,
    isClickDropdown,
    time,
    getIsUpdateData
}: inputDataProps) 
{
    // 表示用
    const [day, setDay] = useState<string>("");             // 日の入力値
    const [category, setCategory] = useState<string>("");   // カテゴリの入力値
    const [money, setMoney] = useState<string>("");         // お金の入力値
    const [note, setNote] = useState<string>("");           // 備考の入力値

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
    const [inputTitle, setInputTitle] = useState<string[]>(["Day", "Category", "Money", "Memo", ""]);
    const [inputDataArray, setInputDataArray] = useState<string[]>(["", "", "", ""]);
    const [countInput, setCountInput] = useState<number>(0);                                // 入力番目
    const [inputData, setInputData] = useState<string>("");                                 // データ入力
    const [categoryData, setCategoryData] = useState<categoryDataType[]>([]);               // category_tableのデータを設定
    const [returnCategory, setReturnCategory] = useState<string>("");                        // categoryを戻す処理用のデータ
    
    const [isOpen, setIsOpen] = useState<boolean>(true);                                    // inputData開閉状態

    /**
     * expenseデータ保存処理
     */
    const handleSaveInputData = () => {
        console.log([...inputDataArray, time.time_id.toString()]);

        const makeDataForSave: saveDataType = {
            day: parseInt(inputDataArray[0]),
            category_id: parseInt(inputDataArray[1]),
            money: parseInt(inputDataArray[2]),
            note: inputDataArray[3],
            time_id: time.time_id,
        }
        const saveExpense = handleSaveExpense(makeDataForSave);
        saveExpense.then((res) => {
            // expense table更新された場合、状態更新
            if (res.success) {
                getIsUpdateData();
                handleInitial();
            }
            console.log(res.mess);
        })
    }
    /**
     * 初期化処理
     */
    const handleInitial = () => {

        setCountInput(0);
        setInputDataArray(["", "", "", ""]);
        setInputData("");
        setReturnCategory("");

        // 表示用初期化
        setDay("");
        setCategory("");
        setMoney("");
        setNote("")
    }

    /**
     * 入力を戻す処理
     */
    const handleReturnData = () => {

        if (countInput > 0) {

            // 表示用
            let count = countInput - 1;
            switch (count) {
                case 0:
                    setDay("");
                    break;
                case 1:
                    setCategory("");
                    setReturnCategory("");
                    break;
                case 2:
                    setMoney("");
                    break;
                case 3:
                    setNote("")
                    break;
            }

            let arrayData: string[] = inputDataArray;
            
            // カテゴリ配列要素格納
            if (count === 1) {
                setInputData(returnCategory);
            } else {
                setInputData(arrayData[count]);
            }
            
            console.log(arrayData, count, arrayData[count]);
            // １個前の要素を初期化
            arrayData[count] = "";
            // 保存用の配列をセットする
            setInputDataArray(arrayData);
            setCountInput(countInput-1);
        } 
    }

    /**
     * Enterキー押下後の処理
     * * 入力したデータを一時的に保存する
     * * ４つまで入力されている場合、Enterキーを押下すると保存処理を実行する
     * @param event 
     */
    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        // enter keyを押下する時、入力データを取得
        if (event.key === 'Enter') {
            // 入力するタイムを選択しない場合、入力させない
            if (time.year === 0 && time.month === 0) {
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
                    setReturnCategory(inputData);
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
                //保存
                handleSaveInputData();
                setCountInput(0);
                setInputDataArray(["", "", "", ""]);
            }
            console.log(inputDataArray);
        }
    }
    
    useEffect(() => {
        
        const getCategory = handleGetAllCategory();
        getCategory.then((res) => {
            if (res.success && res.data && res.data.length > 0) {
                setCategoryData(res.data);
            } else {
                setCategoryData([]);
            }
        });
        // 初期化
        handleInitial();
    }, [isClickDropdown, isCategoryUpdate])
    
    // console.log("input data");
    return <>
        <div className={`input-data-body${isOpen ? "" : " body-close"}`}>
            <div className="input-data-show border-1p">
                <span className="input-data-show-box" style={{fontWeight: "bold", fontSize: "20px"}}>List input</span>
                <div className="input-data-show-day input-data-show-box">
                    <span className={`day-box ${day !== "" ? "font-bold" : ""}`}>Day: </span>
                    <span>{day}</span>
                </div>
                <div className="input-data-show-category input-data-show-box">
                    <span className={category !== "" ? "category-box font-bold": "category-box"}>Category: </span>
                    <span>{category}</span>
                </div>
                <div className="input-data-show-money input-data-show-box">
                    <span className={money !== "" ? "money-box font-bold": "money-box"}>Money: </span>
                    <span>{money}</span>
                </div>
                <div className="input-data-show-note input-data-show-box">
                    <span className={note !== "" ? "note-box font-bold": "note-box"}>Note: </span>
                    <span>{note}</span>
                </div>
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
                                choosedTarget={inputData}
                                isShowDetail={false}
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