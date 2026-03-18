import { useEffect, useState } from "react";

import { handleGetAllTime } from "../services/api";


type selectMonthOfEachYearType = {
    year: string;
    months: string[];
}
type timeDbType = {
    time_id: number;
    year: number;
    month: number;
}

type MonthListProps = {
    times?: timeDbType[];
    handleClickMonth: (value?: number) => void;
    handleCheckBoxMonth: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 
 * @param months 月 
 * @param hanlde　メイン画面制御 
 * @returns 
 */
function MonthList({ times ,handleCheckBoxMonth, handleClickMonth}:MonthListProps)
{
    // const [months, setMonths] = useState<string[]>([]);

    // useEffect(() => {
    //     const getTime = handleGetAllTime(year);
    // }, [times]);

    return <>
        <div className="months-btn-area">
        {
            times && times.length > 0 ? times.map((value):any => (
                <div className="month-btn-body" key={value.time_id}>
                    <button className="dropdown-btn btn-month" onClick={() => handleClickMonth(value.time_id)}>{value.month}</button>
                    <input value={value.time_id} type="checkbox" onChange={(e) => handleCheckBoxMonth(e)}/>     

                </div>
            ))
            :
                <button className="dropdown-btn btn-month">Input your month</button>
        }
        </div>
    </>;
}

export default MonthList;