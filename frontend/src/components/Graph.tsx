import { useEffect, useState } from 'react';


import BarChartC from './BarChartC';

import '../css/graph.css'

type timeType = {
    time_id: number;
    year: number;
    month: number;
}

interface GraphType {
    time: timeType;
}


function Graph({time}: GraphType)
{
    return <>
        <div id="graph">
            <div className="graph-main">
                <div className="graph-header">
                    <div className="graph-title">
                        <h2>Graph {time.year}年{time.month}月</h2>
                    </div>
                    <div className="graph-function">

                    </div>
                </div>
                <div className="graph-body">
                    <div className="graph-show">
                        <BarChartC
                            
                        />
                    </div>
                </div>
            </div>
        </div>
    
    </>
}


export default Graph;