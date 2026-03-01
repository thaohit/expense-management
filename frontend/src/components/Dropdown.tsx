import { useState } from "react";
// Icon
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// 
import BtnIcon from "./BtnIcon";


import "../css/dropdown.css";



/**
 * 
 * @param year 年
 * @param children monthList 
 * @returns 
 */
function Dropdown({year, children}:any)
{
    // Click Year and drop down month list
    const [isOpen, setIsOpen] = useState(false);

    return <>
        <div className="dropdown">
            <div className="dropdown-up" 
                onClick={ () => setIsOpen(!isOpen)}
            >
                <button className="dropdown-btn">
                    <span>{year}</span>
                </button>
                
                <span className={ isOpen ? "icon rotate" : "icon"}>
                    <ArrowDropDownIcon />
                </span>
            </div>
            <div className={ isOpen ? "dropdown-down menu-open": "dropdown-down"}>
                <div className="icon">
                    <div className=""><span>Month</span></div>
                        <BtnIcon />
                </div>
                {children}
            </div>
        </div>
    </>;
}


export default Dropdown;