type getTimeDateType = {
    time_id: number;
    year_id: number;
    month: number;
    year_name: number
}

type MonthListProps = {
    times?: getTimeDateType[];
    handleClickMonth: (time_id: number, month: number) => void;
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

    return <>
        <div className="months-btn-area">
        {
            times && times.length > 0 ? times.map((value):any => (
                <div className="month-btn-body" key={value.time_id}>
                    <button className="dropdown-btn btn-month" onClick={() => handleClickMonth(value.time_id, value.month)}>{value.month}</button>
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