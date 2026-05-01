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
    year: number;                   // 年
    id?: number;                    // year_id
    isComponent: string;    // 年ごとの金額統計一覧表示状態
    handleSelectTimeForMainArea: (year_id:number, time_id: number, year: number, month: number) => void;  // 月をクリックする処理
    handleCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;   // 月を選択する処理
    handleSetIsUpdate: () => void;  // timeデータ削除後の状態を更新
    handleSetIsClickDropdown: () => void; // timeデータ削除後の状態を初期化
    handleSetYear?: (year: number) => void;  // yearデータを設定
    children?: React.ReactNode;
}

type getTimeDateType = {
    time_id: number;
    year_id: number;
    month: number;
    year_name: number;
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
function Dropdown({
    year = 0,
    id = 0,
    isComponent,
    handleCheckBox,
    handleSelectTimeForMainArea,
    handleSetIsUpdate,
    handleSetIsClickDropdown,
    handleSetYear
}:DropDownProps)
{
    const [timeData, setTimeData] = useState<getTimeDateType[]>([]);
    // Click Year and drop down month list
    const [isOpen, setIsOpen] = useState(false);                                    // 開閉の状態
    const [monthsForBtn, setMonthsForBtn] = useState<number[]>([]);                 // 削除処理用の月の選択したデータ
    const [updateDataState, setUpdateDataState] = useState<boolean>(false);         // DB
    const [monthCheckBox, setMonthCheckBox] = useState<selectMonthOfEachYearType[]>([]);
    const [yearCheckBox, setYearCheckBox] = useState<number[]>([]);                 // ＊selectedCheckBoxとどっち使えるか次回確認

    const [isStatistics, setIsStatistics] = useState<boolean>(false);               // statistics component表示状態
    /**
     * 保存ボタンの処理
     * @param data 
     * @param inputType 
     */
    const handleSave = (data: number): void => {

        if (data < 0 || data > 12) {
            alert("1~12の数値を入力してください！");
            return;
        }
        // 変数宣言
        // APIに渡すデータを調整する
        const makeDataToSave = {
            year_id: id,
            month: data
        };
        console.log(makeDataToSave);
        // APIにデータを渡し、処理を要求する
        const resSaveTime = handleSaveTime(makeDataToSave);
        resSaveTime.then((res) => {
            if (res.success) {
                setUpdateDataState(!updateDataState);
            }
            alert(res.mess);
        });
    }

    /**
     * 削除ボタンの処理
     * * チェックボックスで選択されたデータを削除するのを送信する
     * @param data 
     */
    const handleDelete = (data: number[]) => {
        
        if (!confirm("月を削除する場合には支出・収入データとカテゴリデータも削除されます! \nよろしいですか?")) {
            return;
        } 
        const resDelTime = handleDeleteTime(data);
        resDelTime.then((res) => {
            if(res.success) {
                setUpdateDataState(!updateDataState);
                handleSetIsUpdate();
                handleSetIsClickDropdown();
            }
            alert(res.mess);
        })
    }

    /**
     * チェックボックス処理
     * @param e 
     */
    const handleCheckBoxYear = (e: React.ChangeEvent<HTMLInputElement>) => {

        //削除用のデータを送信
        handleCheckBox(e);

        // チェックボックスのselected用のデータをセットする
        let value = parseInt(e.target.value);
        setYearCheckBox((item) => {
            console.log(item.includes(value));
            if (item.includes(value)) {
                return item.filter((val) => val !== value)
            } else {
                return [...item, value];
            }
        });
    }

    // -------------改善--------------
    // 改善が必要、今後時間があればする
    // チェックボックスに関する処理
    /**
     * 年ごとの月の選択処理
     * * チェックボックス値を取得したり、除外したりする
     * @param e 
     */
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

    /**
     * 月辺りボタンを押下する処理
     * * 受け取ったデータをメインに渡す
     * @param time_id 
     * @param month 
     */
    const handleGetClickMonth = (year_id: number, time_id: number, month: number) => {
        handleSelectTimeForMainArea(year_id, time_id ,year, month);
    }

    /**
     * 年を選択する処理
     * * statistics表示時に、年選択を有効にする
     * * statistics非表示に、年選択を無効にし、月選択を有効にする
     * * 
     * @returns void
     */
    const handleSelectYear = () => {
        if (isComponent === "statistics") {
            if (id) {
                handleSelectTimeForMainArea(
                    id, 0, year, 0
                );
            }
            return;
        }
        setIsOpen(!isOpen);
    }


    useEffect(() => {
        let ignore = false; // Clear up
        if (ignore === false) {
            const getTime = handleGetAllTime(id);
            getTime.then((res) => {
                let timeData: getTimeDateType[] = [];
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        timeData = res.data;
                    }
                }
                setTimeData(timeData);
            });
        }
        return () => {ignore = true;} 

    }, [updateDataState, isComponent])

    useEffect(() => {
        // 金額統計一覧が表示される場合、ドロップダウン非表示
        setIsStatistics((pre) => {
            return isComponent === "statistics" ? true : false;
        })
    }, [isComponent])

    return <>
        <div className="dropdown">
            <div className="dropdown-up" >
                <button className="dropdown-btn" onClick={ () => handleSelectYear()}>
                    <span>{year}</span>
                </button>
                <input
                    type="checkbox"
                    value={id}
                    checked={yearCheckBox?.includes(id)}
                    className="dropdown-up-check-box"
                    onChange={(e) => handleCheckBoxYear(e)}
                />
                <span className={ isOpen && isStatistics === false? "icon rotate" : "icon"}>
                    <ArrowDropDownIcon />
                </span>
            </div>
            <div className={ isOpen && isStatistics === false? "dropdown-down menu-open": "dropdown-down"}>
                {/* 入力項目とボタン */}
                <BtnIcon 
                    title="Month"
                    type="m"
                    isUpdateData={updateDataState}
                    handleData={monthsForBtn}
                    handleSave={handleSave}
                    handleDel={handleDelete}
                />
                {/* 月のリスト */}
                <MonthList 
                    times={timeData}
                    handleCheckBoxMonth={handleCheckBoxMonth}
                    handleClickMonth={handleGetClickMonth}
                />
            </div>
        </div>
    </>;
}


export default Dropdown;