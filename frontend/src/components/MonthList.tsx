
/**
 * 
 * @param months 月 
 * @param hanlde　メイン画面制御 
 * @returns 
 */
function MonthList({months, hanlde}:any)
{
    return <>
        {
            months.map((value:string, index:number):any => (
                
                <button key={index} className="dropdown-btn btn-month" onClick={() => hanlde(value)}>{value}</button>
            ))
        }
    </>;
}

export default MonthList;