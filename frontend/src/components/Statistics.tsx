import { useEffect, useState } from 'react';


// Component
import Thead from './Thead';
import Tbody from './Tbody';

import '../css/statistics.css';

// timeデータタイム
type timeDataType = {
    year_id: number;
    time_id: number;
    year: number;
    month: number;
}

// 統計タイプ
interface StatisticsType {
    time: timeDataType;
    datas: statisticsDataForYearType;
}

// 一年の支出・収入一覧タイプ
type statisticsDataForYearType = {
    inComeList: string[][];
    spendList: string[][];
    sumIncome: string;
    sumSpend: string;
    remainAmount: string;
}

const tHeadData = ["Category", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

/**
 * 統計一覧表を表示する
 * @param time
 * @param datas
 * @returns 
 */
function Statistics({ time, datas }: StatisticsType)
{

    return <>
        <div id="statistics">
            <div className="statistics-main">
                <div className="statistics-header">
                    <div className="statistics-title">
                        <h2>Statistics {time.year}年 year_id: {time.year_id}</h2>
                    </div>
                    <div className="statistics-handle-area">
                        <p>Show:<input type="checkbox" name="" id="" /></p>
                        <p><input type="text" name="" id="" /></p>
                    </div>
                </div>
                <div className="statistics-body">
                    <div className="income-statistics-table">
                        <div className="">
                            <h3>Income</h3>
                        </div>
                        <table>
                            <Thead thData={tHeadData}/>
                            <Tbody tdData={datas.inComeList} currency="¥"/>
                        </table>
                    </div>
                    <div className="spending-statistics-table">
                        <div className="">
                            <h3>Spending</h3>
                        </div>
                        <table>
                            <Thead thData={tHeadData}/>
                            <Tbody tdData={datas.spendList} currency="¥"/>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </>
}

export default Statistics;