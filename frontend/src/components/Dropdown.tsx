import { useEffect, useState } from "react";
// Icon
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Component
import BtnIcon from "./BtnIcon";
import MonthList from "./MonthList";


import "../css/dropdown.css";

// API
import { handleDeleteTime, handleGetAllTime, handleSaveTime, handleSaveYear } from "../services/api";

type DropDownProps = {
    homeReCount: number;            // ホームページのrender回数
    year: number;                   // 年
    id?: number;                    // year_id
    handleClickMonth: (value?: number) => void;                         // 月をクリックする処理
    handleCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;   // 月を選択する処理
    children?: React.ReactNode;
}

type timeDbType = {
    time_id: number;
    year: number;
    month: number;
}

type selectMonthOfEachYearType = {
    year: number;
    months: number[];
}

/**
 * 
 * @param year 年
 * @param children monthList 
 * @returns 
 */
function Dropdown({homeReCount, year, id, handleCheckBox, handleClickMonth}:DropDownProps)
{
    const [timeData, setTimeData] = useState<timeDbType[]>([]);
    // Click Year and drop down month list
    const [isOpen, setIsOpen] = useState(false);                                    // 開閉の状態
    const [monthsForBtn, setMonthsForBtn] = useState<number[]>([]);                 // 削除処理用の月の選択したデータ
    const [updateDataState, setUpdateDataState] = useState<boolean>(false);         // DB
    const [monthCheckBox, setMonthCheckBox] = useState<selectMonthOfEachYearType[]>([]
    //     () => {
    //     return [
    //         {
    //             year: "",     
    //             months: []
    //         }
    //     ]
    // }
    );

    /**
     * 保存ボタンの処理
     * @param data 
     * @param inputType 
     */
    const handleSave = (data: number):void => {

        // 変数宣言
        // APIに渡すデータを調整する
        const makeDataToSave = {
            year: year,
            month: data
        };
        let resMess: string = "";
        console.log(`input month ${makeDataToSave.month} year ${makeDataToSave.year}`);
        const resSaveTime = handleSaveTime(makeDataToSave);
        resSaveTime.then((res) => {
            if (res.success) {
                setUpdateDataState(!updateDataState);
            }

            if (res.mess) {
                resMess = res.mess;
            }

            alert(resMess);
        })
    }

    /**
     * 削除ボタンの処理
     * @param data 
     */
    const handleDelete = (data: number[]) => {
        
        const resDelTime = handleDeleteTime(data);
        let message = "";
        resDelTime.then((res) => {
            if(res.success) {
                setUpdateDataState(!updateDataState);
                if (res.mess) {
                    message = res.mess
                }
            }
            alert(`Delete Ok ${message}`);
        })
        console.log("view delete ", resDelTime);


    }

    // -------------改善--------------
    // 改善が必要、今後時間があればする
    // チェックボックスに関する処理
    const handleCheckBoxMonth = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: number = parseInt(e.target.value);
        console.log(value);
        let monthOfEachYear: selectMonthOfEachYearType[] = monthCheckBox;
        let listNum: number = 0;
        let checkMonthInList: boolean = false;

        // 既に月が選択される場合、該当の年や月を取得
        let monthOfEachYearLength = monthOfEachYear.length;
        if (monthOfEachYearLength > 0) {
            // 該当データがある場合、一時的な変数に格納し終了
            for (let i = 0; i < monthOfEachYearLength; i++) {
                if (monthOfEachYear[i].year === year) {
                    listNum = i;
                    checkMonthInList = true;
                    break;
                }
            }

            // 該当データがない場合かつ、年月配列にデータがある場合、新い配列を挿入する
            if (checkMonthInList === false && year) {
                listNum = monthOfEachYearLength + 1;
                monthOfEachYear.push({
                    year: year,
                    months: []
                })
            }
            
        } else {
            // データがない場合、初期化
            if (year) {
                monthOfEachYear.push({
                    year: year,
                    months: []
                })
            }
        }

        // 配列に月がなければ、月の配列を作成
        if (!monthOfEachYear[listNum].months.includes(value)) {
            monthOfEachYear[listNum].months.push(value);
        } else {
            let delMonthNum = monthOfEachYear[listNum].months.indexOf(value);
            monthOfEachYear[listNum].months.splice(delMonthNum, 1)
        }
        
        // btniconの月配列をセットする
        setMonthsForBtn(monthOfEachYear[listNum].months);

        // checkboxで選択した月をセットする
        setMonthCheckBox(monthOfEachYear);
    }

    useEffect(() => {

        let ignore = false; // Clear up
        
        if (ignore === false) {
            const getTime = handleGetAllTime(year);
            getTime.then((res) => {
                let timeData: timeDbType[] = [];
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        timeData = res.data;
                    }
                }
                console.log(timeData);
                setTimeData(timeData);
            });
            
        }
        console.log("time render");
        return () => {ignore = true;} 

    }, [updateDataState])

    return <>
        <div className="dropdown">
            <div className="dropdown-up" >
                <button className="dropdown-btn" onClick={ () => setIsOpen(!isOpen)}>
                    <span>{year}</span>
                </button>
                <input type="checkbox" value={id} className="dropdown-up-check-box" onChange={(e) => handleCheckBox(e)}/>
                <span className={ isOpen ? "icon rotate" : "icon"}>
                    <ArrowDropDownIcon />
                </span>
            </div>
            <div className={ isOpen ? "dropdown-down menu-open": "dropdown-down"}>
                <BtnIcon 
                    title="Month"
                    type="m"
                    handleData={monthsForBtn}
                    handleSave={handleSave}
                    handleDel={handleDelete}
                />
                <MonthList 
                    times={timeData}
                    handleCheckBoxMonth={handleCheckBoxMonth}
                    handleClickMonth={handleClickMonth}
                />
            </div>
        </div>
    </>;
}


export default Dropdown;