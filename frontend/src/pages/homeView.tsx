import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Icon
import AccountBoxSharpIcon from '@mui/icons-material/AccountBoxSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import AddchartIcon from '@mui/icons-material/Addchart';

// Components
import Dropdown from '../components/Dropdown';
import BtnIcon from '../components/BtnIcon';
import HomeMain from '../components/MainHome';
import CategoryAddArea from '../components/CategoryAddArea';
import Graph from '../components/Graph';
import Statistics from '../components/Statistics';

// api
import {
    handleGetAllYear,
    handleSaveYear,
    handleDeleteYear,
    handleGetStatisticsForYear
} from '../services/api';

// ================ TYPE ================
type yearDbType = {
    year_id: number;
    year_name: number;
}

type timeDataType = {
    year_id: number;
    time_id: number;
    year: number;
    month: number;
}

type mainComponentType = {
    time: timeDataType;
    isCategoryUpdata: boolean;
    isClickDropdown: boolean;
}

// 一年の支出・収入一覧タイプ
type statisticsDataForYearType = {
    inComeList: string[][];
    spendList: string[][];
    sumIncome: string;
    sumSpend: string;
    remainAmount: string;
}

/** function Home
 * ホームページ
 * @returns 
 */
function Home() {
    
    const navigate = useNavigate();
    const [yearDB, setYearDB] = useState<yearDbType[]>([]);           
    const [yearCheckBox, setYearCheckBox] = useState<number[]>([]);             // 選択した年のidのリスト
    
    const [isOpen, setIsOpen] = useState<boolean>(true);                        // サイドバーの状態　true | false
    const [isCategoryAdd, setIsCategoryAdd] = useState<boolean>(false);         // category追加画面を表示するか true or false
    const [updateDataState, setUpdateDataState] = useState<boolean>(true);      // DBとの処理が実行された場合、re-render
    const [isClickDropdown, setIsClickDropdown] = useState<boolean>(false);           // タイムの選択状態
    const [isComponent, setIsComponent] = useState<string>("home");
    const [isShowAllSta, setIsShowAllSta] = useState<boolean>(false);           // 一年ごとの統計表示

    const [timeForComponent, setTimeForComponent] = useState<timeDataType>({
        year_id: 0,
        time_id: 0,
        year: 0,
        month: 0
    });                                                                         // componentのtimeを設定

    const [statisticsData, setStatisticsData] = useState<statisticsDataForYearType>({
        inComeList: [],
        spendList: [],
        sumIncome: "0",
        sumSpend: "0",
        remainAmount: "0"
    });
    
    /**
     * main component 切り替える
     * @param param0 
     * @returns 
     */
    const MainComponent = ({ time, isCategoryUpdata, isClickDropdown}: mainComponentType) => {

        switch (isComponent) {
            case "home":
                return <HomeMain
                            isCategoryUpdata={isCategoryUpdata}
                            time={time}
                            isClickDropdown={isClickDropdown}
                        /> 
            case "category":
                return <CategoryAddArea
                            time={time}
                            isClickDropdown={isClickDropdown}
                        />
            case "graph":
                return <Graph
                    time={time}
                />
            case "statistics":
                return <Statistics
                    time={time}
                    datas={statisticsData}
                />
        }
        return 
    }

    // =========== hanle eara =====================
    // mainComponent 切り替え処理
    const handleChangeMainComponent = (type: string) => {

        let getType: string = type;

        // 2回目押下の場合、homeに遷移
        if (type === isComponent) {
            getType = "home";
        }
        setIsComponent(getType);
        // 統計一覧画面をクリックする場合
        // データを取得するために、isclickdown更新
        if (type === "statistics") {
            setIsShowAllSta(!isShowAllSta);
            setIsClickDropdown(!isClickDropdown);
        }
    }

    const changePage = ():void => {
        // navigate("/login", {state: { key: "abc"}}); 
        const data = ["1", "2", "2", "3"];

        const place = data.map(() => "?");
        console.log(place);
    }

    /**
     * 年保存ボタン押下の処理
     * 
     * @param data 
     * @param type 
     */
    const hanldeSaveYearData = (data: any): void => {

        const numberFormat = /^[0-9]+$/;
        if (!numberFormat.test(data)) {
            alert("数字(0~9)で入力してください。")
            return;
        }

        let year = parseInt(data);
        // データは空欄ではない場合実行
        if (year > 0) {
            const resSaveYear = handleSaveYear(year);
            resSaveYear.then((res) => {
                if (res.success) {
                    setUpdateDataState(!updateDataState);
                }
                alert(res.mess);
            });
        } else {
            alert("0以上の数字を入力してください。")
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
                }
                alert(res.mess);
            });
        } else {
            alert("yearを選択してください。")
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
        console.log(yearCheckBox);
        setYearCheckBox(delYearId);
    }

    /**
     * drowdownから選択されたタイムを取得
     * @param time_id 
     * @param year 
     * @param month 
     */
    const handleSelectTimeForMainArea = (
        year_id: number,
        time_id: number,
        year: number = 0,
        month: number = 0
    ) => {
        // Componentのタイムデータをセットする
        setTimeForComponent({
            year_id: year_id,
            time_id: time_id,
            year: year,
            month: month
        });
        setIsClickDropdown(!isClickDropdown);
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
                if (res.success) {
                    // 年のデータがある場合、dataに代入する
                    if(res.data && res.data.length > 0) {
                        data = res.data;
                    }
                    setYearDB(data);
                }
            }
        });
        return () => {ignore = true;} 
        
    }, [updateDataState]);

    // isClickDropdown変更された場合、支出・収入一覧データ取得
    useEffect(() => {
        if (isComponent === "statistics") {
            const getStatisticsForYear = handleGetStatisticsForYear(timeForComponent.year_id);
            getStatisticsForYear.then((res) => {
                if (res.success && res.data) {
                    setStatisticsData(res.data);
                }
            })
        }
    }, [isClickDropdown])

    return <>
            <div id="home-page">
                <div className={`sidebar${isOpen ? "" : " sidebar-close"}`}>
                    <div id="menu-icons">
                        <div className="up">
                            <AccountBoxSharpIcon />
                        </div>
                        <div className="dowm">
                            <BtnIcon props={true}>
                                <span onClick={changePage} title="Logout"><LogoutSharpIcon /></span>
                                <span title="Graph" onClick={() => handleChangeMainComponent("graph")}><EqualizerIcon /></span>
                                <span><AddAlertIcon /></span>
                                <span title="Statistics" onClick={() => handleChangeMainComponent("statistics")}><FormatListBulletedAddIcon /></span>
                                <span title="AddCategory" onClick={() => handleChangeMainComponent("category")}><AddchartIcon/></span>
                            </BtnIcon>
                        </div>
                    </div>

                    <div id="sidebar-main">
                        <div className="year-area-bar">
                            <BtnIcon 
                                title="Year"
                                style="medium"
                                type="y"
                                isUpdateData={updateDataState}
                                handleData={yearCheckBox}
                                handleSave={hanldeSaveYearData}
                                handleDel={handleDelete}
                            />      
                        </div>
                        <div id="year-btn-area">
                            {yearDB.map((value) => (
                                <div className="year-btn" key={value.year_id}>
                                    <Dropdown
                                        year={value.year_name}
                                        id={value.year_id}
                                        isComponent={isComponent}
                                        handleCheckBox={handleCheckBox}
                                        handleSelectTimeForMainArea={handleSelectTimeForMainArea}
                                        handleSetIsUpdate={() => setUpdateDataState(!updateDataState)}
                                        handleSetIsClickDropdown={() => {
                                            setTimeForComponent({
                                                year_id: 0,
                                                year: 0,
                                                time_id: 0,
                                                month: 0
                                            });

                                            setIsClickDropdown(!isClickDropdown);
                                        }}
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
                    <MainComponent 
                        isCategoryUpdata={isCategoryAdd}
                        time={timeForComponent}
                        isClickDropdown={isClickDropdown}
                    />
                </div>
            </div>
        </>

}


export default Home;