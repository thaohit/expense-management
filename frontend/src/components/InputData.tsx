
import '../css/inputdata.css';

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { useEffect, useState } from 'react';
import BtnIcon from './BtnIcon';
import Table from '../components/Table';
import CategoryTable from './CategoryTable';

type CategoryProps = {
    no: string;
    category: string;
};

type InputDataType = {
    title: string[];
    data: string[];
}

const CategoryTitlte: string[] = ["No", "Category"];
const CategoryBody: CategoryProps[] = [
    {no: "1", category: "Eat"},
    {no: "2", category: "House"},
    {no: "3", category: "Water"},
    {no: "4", category: "Another"}
];

// const inputeTitle: string[] = ["Ngày", "Mục", "Số tiền", "Ghi chú"];
const emptyArray: string[] = ["", "", "", ""];


function InputData({ sideBarIsOpen = true }) 
{
    const [day, setDay] = useState<string>("1");
    const [category, setCategory] = useState<string>("Eat");
    const [money, setMoney] = useState<string>("10000");
    const [note, setNote] = useState<string>("Khong gi");

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
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [categoryIsUp, setCategoryIsUp] = useState<boolean>(false);
    const [countInput, setCountInput] = useState<number>(0);
    const [inputData, setInputData] = useState<string>("");
    const [test, settest] = useState<boolean>(true);


    const hanldeInputData = () => {
        
    }

    const handleReturnData = () => {

        if (countInput > 0) {

            let arrayData: string[] = inputDataArray;
            let count = countInput;
            arrayData[count] = "";
            
            console.log(arrayData[count]);
            setInputData(arrayData[count - 1]);
            setInputDataArray(arrayData);

            setCountInput(countInput-1);
        } 
    }
    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        // enter keyを押下する時、入力データを取得
        if (event.key === 'Enter') {
            if (inputData === "" && countInput < 3) {
                alert("Input your data!");
            }
            // if (countInput === 0) {
            //     setDay(inputData);
            // } else if (countInput === 1) {
            //     setCategory(inputData);
            // } else if (countInput === 2) {
            //     setMoney(inputData);
            // } else {
            //     setNote(inputData)
            // }
            else {
                let arrayData: string[] = inputDataArray;
                
                arrayData[countInput] = inputData;
    
                setInputDataArray(arrayData);
                setCountInput(countInput+1);
                setInputData("");

            }
            console.log(inputDataArray, countInput);
            if (countInput > 3) {
                setCountInput(0);
                setInputDataArray(["", "", "", ""]);
            }
            
            console.log(event.key, countInput);
        }
    }

    console.log(sideBarIsOpen);
    return <>
        <div className={`input-data-body${isOpen ? "" : " body-close"}`}>
            <div className="input-data-show border-1p">
                <span className="input-data-show-box">Mục đã nhập </span>
                {/* <div className="input-data-show-day input-data-show-box">
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
                </div> */}
                {inputTitle.map((val, index) => (
                    <div className="input-data-show-box" key={index}>
                        <span className={note !== "" ? "note-box font-bold": "note-box"}>{val} </span>
                        <span>{inputDataArray[index]}</span>
                    </div>
                ))}
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
                                title={CategoryTitlte}
                                body={CategoryBody}
                            />
                        : 
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