import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Icon
import AccountBoxSharpIcon from '@mui/icons-material/AccountBoxSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

// Components
import Dropdown from '../components/DropDown';
import MonthList from '../components/MonthList'
import BtnIcon from '../components/BtnIcon';
import InputData from '../components/InputData';



const months:string[] = ["thang 1", "thang 2", "thang 3", "thang 4"];
const years:string[] = ["2024", "2025", "2026", "2027"];
/** function Home
 * ホームページ
 * @returns 
 */
function Home() {
    const navigate = useNavigate();
    const changePage = ():void => {
        navigate("/login", {state: { key: "abc"}}); 
    }
    
    const handleYearArea = (): void => {

    }

    const testbtnmont = (year:string) => {
        alert(year);
    };
    
    return <>
            <div id="home-page">
                <div id="sidebar">
                    <div id="menu-icons">
                        <div className="up">
                            <AccountBoxSharpIcon />

                        </div>
                        <div className="dowm">
                            <BtnIcon drops={false}>
                                <span onClick={changePage} title="Logout"><LogoutSharpIcon /></span>
                                <span><EqualizerIcon /></span>
                                <span><AddAlertIcon /></span>
                                <span><FormatListBulletedAddIcon /></span>
                            </BtnIcon>
                        </div>
                    </div>

                    <div id="sidebar-main">
                        <div className="year-area-bar">
                            <div className="icon">
                                <div className=""><span style={{fontSize: "20px"}}>Year</span></div>
                                <BtnIcon style={"medium"}/>      
                            </div>
                        </div>
                        <div id="year-btn-area">
                            {years.map((value:string, index:number) => (
                                <div className="year-btn" key={index}>
                                    <Dropdown year={value}>
                                        <MonthList months={months} hanlde={testbtnmont}/>
                                    </Dropdown>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div id="main">
                    <div className="main-header">
                        <div className="main-header-title border-1p">
                            <h1>Home Page</h1>
                        </div>
                        <BtnIcon />
                    </div>
                    <div className="main-input-data border-1p">
                        <InputData />
                    </div>
                    <div className="main-body border-1p"></div>
                </div>
            </div>
        </>

}


export default Home;