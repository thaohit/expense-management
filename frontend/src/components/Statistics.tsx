import { useEffect, useState } from 'react';


// Component
import Thead from './Thead';
import Tbody from './Tbody';

import '../css/statistics.css';

// timeデータタイム
type timeType = {
    time_id: number;
    year: number;
    month: number;
}

// 統計タイプ
interface StatisticsType {
    time: timeType
}
/**
 * 統計一覧表を表示する
 * @param time 
 * @param time 
 * @returns 
 */
function Statistics({ time }: StatisticsType)
{
    return <>
        <div id="statistics">
            <div className="statistics-main">
                <div className="statistics-header">
                    <div className="statistics-title">
                        <h2>Statistics {time.year}年{time.month}月</h2>
                    </div>
                </div>
                <div className="statistics-body">
                    <div className="statistics-table">
                        <table>
                            <Thead thData={[]}/>
                            <Tbody tdData={[]}/>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </>
}

export default Statistics;