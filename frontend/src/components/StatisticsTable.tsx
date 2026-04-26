
// 
import '../css/statistics-table.css';

//
import { useEffect, useState } from 'react';

// Component
import Thead from "./Thead";
import Tbody from "./Tbody";

type sumInOutType = {
    sumInCome: number;
    sumPay: number;
}


interface statisticsProps {
    tHead: string[];
    tBody: string[][];
    sumInOut: sumInOutType;
}

/**
 * 支出・収入一覧
 * @param param0 
 * @returns 
 */
function StatisticsTable({
    tHead,
    tBody,
    sumInOut
}: statisticsProps)
{                      

    const [remainAmount , setRemainAmount] = useState<number>(0);
    const [isMinus, setIsMinus] = useState<boolean>(false);

    // 支出・収入一覧取得
    useEffect(() => {
        console.log("sum: ", tBody);
        let amount = sumInOut.sumInCome - sumInOut.sumPay;
        if (amount < 0) {
            setIsMinus(true);
        } else {
            setIsMinus(false);
        }

        setRemainAmount(amount);
    //     // 最大月を取得
    //     let maxMonth = time_ids.length < 2 ?
    //         time_ids[0] :
    //         time_ids.reduce((pre, curr) => pre > curr ? pre : curr);
    //     // 月のリストを初期化 (1~maxMonth)
    //     let monthList = tHead;
    //     for (let m = 0; m < maxMonth; m++) {
    //         monthList.push((m+1).toString());
    //     }
    //     setThead(monthList);

    //     const getData = handleGetStatistics(time_ids);
    //     getData.then((res) => {
    //         if (res.success && res.data) {
    //             setStatisticsData(res.data)
    //         } else {

    //         }
    //     })


    }, [tBody]);

    return <>
        <div className="create-table dis-contents">
            <div className="show-detail">
                <p>Tong thu: {sumInOut.sumInCome}</p>
                <p>Tong chi: {sumInOut.sumPay}</p>
                <p>Con lai: {remainAmount}</p>
            </div>
            <div className="show-table show-table-statistics">
                <table>
                    <Thead thData={tHead}/>
                    <Tbody tdData={tBody}/>
                </table>
            </div>
        </div>
    </>
}

export default StatisticsTable;