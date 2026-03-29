import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Icon
import AccountBoxSharpIcon from '@mui/icons-material/AccountBoxSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import CheckIcon from '@mui/icons-material/Check';
import AddchartIcon from '@mui/icons-material/Addchart';

// Components
import Dropdown from '../components/Dropdown';
import MonthList from '../components/MonthList'
import BtnIcon from '../components/BtnIcon';
import InputData from '../components/InputData';
import Table from '../components/Table';
import HomeMain from '../components/MainHome';
import CategoryAddArea from '../components/CategoryAddArea';



// api
import { handleGetAllYear, handleSaveYear, handleDeleteYear } from '../services/api';

type TableBody = {
    day: string;
    category: string;
    money: number;
    note: string;
}

type yearDbType = {
    year_id: number;
    year_name: number;
}

type timeType = {
    time_id: number;
    year: number;
    month: number;
}

const months:string[] = [];
const years:string[] = ["2024", "2025", "2026", "2027"];
const titles:string[] =  ["Ngày", "Mục", "Số tiền", "Ghi chú"];
const tableData:TableBody[] = [
    {day: "1", category:"Eat", money: 2000, note: "khong gi"},
    {day: "2", category:"Electronic", money: 3000, note: "Tiền điện"},
    {day: "3", category:"Internet", money: 2400, note: "Tiền internet"},
    {day: "4", category:"Presents", money: 10000, note: "Quà tặng ny"},
    {day: "25", category:"House", money: 30000, note: ""}
];


/** function Home
 * ホームページ
 * @returns 
 */
function Home() {
    
    const navigate = useNavigate();
    const [homeRenderCount, setHomeRenderCount] = useState<number>(0);          // ホームページのrender回数
    const [isOpen, setIsOpen] = useState<boolean>(true);                        // サイドバーの状態　true | false
    const [inputYear, setInputYear] = useState<string>("");                     // 年の値
    const [yearDB, setYearDB] = useState<yearDbType[]>([]);           
    const [updateDataState, setUpdateDataState] = useState<boolean>(true);      // DBとの処理が実行された場合、re-render
    const [yearCheckBox, setYearCheckBox] = useState<number[]>([]);             // 選択した年のidのリスト

    const [isCategoryAdd, setIsCategoryAdd] = useState<boolean>(false);         // category追加画面を表示するか true or false
    
    const [yearForComponent, setYearForComponent] = useState<number>(0);        // componentの年を設定
    const [monthForComponent, setMonthForComponent] = useState<number>(0);      // componentの月を設定
    const [timeForComponent, setTimeForComponent] = useState<timeType>({
        time_id: 0,
        year: 0,
        month: 0
    })                                                                          // componentのtimeを設定
    const [isClickMonth, setIsClickMonth] = useState<boolean>(false);           // タイムの選択状態

    // =========== hanle eara
    const changePage = ():void => {
        // navigate("/login", {state: { key: "abc"}}); 
        const data = ["1", "2", "2", "3"];

        const place = data.map(() => "?");
        console.log(place);
    }

    /**
     * 
     */
    const handleDelYearBar = (): void => {

    }

    /**
     * 年保存ボタン押下の処理
     * 
     * @param data 
     * @param type 
     */
    const hanldeSaveYearData = (data: number):void => {
        // データは空欄ではない場合実行
        let errMess: string = "";
        if (data !== 0) {
            const resSaveYear = handleSaveYear(data);
            resSaveYear.then((res) => {
                
                console.log(data, res);
                if (res.success) {
                    setUpdateDataState(!updateDataState);
                } else {
                    if (res.mess?.includes("UNIQUE")) {
                        errMess = `${data}が既に存在した`;
                    } else if (res.mess) {
                        errMess = res.mess;
                    }

                    alert(errMess);
                }
            });
        }
    }

    /**
     * 削除ボタン押下の処理
     * @param data 選択した年リスト
     */
    const handleDelete = (data: number[]) => {

        if (data.length > 0) {
            const resDelYear = handleDeleteYear(data);
            resDelYear.then((res) => {
                console.log(`delete year is ${res.success}`);
                if (res.success) {
                    setUpdateDataState(!updateDataState);
                    setYearCheckBox([]);
                    alert(`delete ok ${data}`);
                } else {
                    alert(res.mess);
                }
            });
        }
    }

    /**
     * 年の選択処理、選択した年をリストに追加したり除外したりする
     * 
     * @param e 
     */
    const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {

        let value: number = parseInt(e.target.value);
        let delYearId: number[] = yearCheckBox;

        if (!delYearId.includes(value)) {
            delYearId.push(value);
        } else {
            let delYearIdArrNum = delYearId.indexOf(value);
            delYearId.splice(delYearIdArrNum, 1)
        }

        setYearCheckBox(delYearId);
    }

    /**
     * drowdownから選択されたタイムを取得
     * @param time_id 
     * @param year 
     * @param month 
     */
    const handleSelectTimeForMainAera = (time_id: number, year: number = 0, month: number = 0) => {
        setYearForComponent(year);
        setMonthForComponent(month);
        setTimeForComponent({
            time_id: time_id,
            year: year,
            month: month
        });
        setIsClickMonth(!isClickMonth);
    };

    // Lỗi khi dùng useEffect
    // useEffect dependency.
    // tham số thứ 2 của useEffect là một array dependency
    // The final argument passed to useEffect changed size between renders
    // tham số thứ 2 là []
    useEffect(() => {

        let ignore = false; // Clear up

        const getYears = handleGetAllYear();
        getYears.then((res) => {

            let data: yearDbType[] = []; // 初期化

            if (ignore === false) {
                // console.log(res.data);
                if (res.success) {
                    // 年のデータがある場合、dataに代入する
                    if(res.data && res.data.length > 0) {
                        data = res.data;
                    }
                    console.log(res.data);
                    setYearDB(data);
                }
            }
        });

        setHomeRenderCount(homeRenderCount + 1);

        return () => {ignore = true;} 

    }, [updateDataState]);

    return <>
            <div id="home-page">
                <div className={`sidebar${isOpen ? "" : " sidebar-close"}`}>
                    <div id="menu-icons">
                        <div className="up">
                            <AccountBoxSharpIcon />
                        </div>
                        <div className="dowm">
                            <BtnIcon props={true} handleSave={handleDelYearBar}>
                                <span onClick={changePage} title="Logout"><LogoutSharpIcon /></span>
                                <span><EqualizerIcon /></span>
                                <span><AddAlertIcon /></span>
                                <span><FormatListBulletedAddIcon /></span>
                                <span title="AddCategory" onClick={() => setIsCategoryAdd(!isCategoryAdd)}><AddchartIcon/></span>
                            </BtnIcon>
                        </div>
                    </div>
                    
                    <div id="sidebar-main">
                        <div className="year-area-bar">
                            <BtnIcon 
                                title="Year"
                                style="medium"
                                type="y"
                                handleData={yearCheckBox}
                                handleSave={hanldeSaveYearData}
                                handleDel={handleDelete}
                            />      
                        </div>
                        <div id="year-btn-area">
                            {yearDB.map((value) => (
                                <div className="year-btn" key={value.year_id}>
                                    <Dropdown
                                        homeReCount={homeRenderCount}
                                        year={value.year_name}
                                        id={value.year_id}
                                        handleCheckBox={handleCheckBox}
                                        handleSelectTimeForMainAera={handleSelectTimeForMainAera}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="close-sidebar" onClick={() => setIsOpen(!isOpen)}>
                    <span className={ isOpen ? "icon" : "icon rotate"}><KeyboardDoubleArrowLeftIcon /></span>
                </div>
                <div id="main">
                    {!isCategoryAdd ? 
                        <HomeMain
                            isCategoryUpdata={isCategoryAdd}
                            year={yearForComponent}
                            month={monthForComponent}
                            time={timeForComponent}
                            isClickMonth={isClickMonth}
                        /> :
                        <CategoryAddArea
                            year={yearForComponent}
                            month={monthForComponent}
                            time={timeForComponent}
                            isClickMonth={isClickMonth}
                        />
                    }
                </div>
            </div>
        </>

}


export default Home;