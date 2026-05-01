
// 
import '../css/statistics-table.css';

// Component
import Thead from "./Thead";
import Tbody from "./Tbody";

interface statisticsProps {
    tHead: string[];
    tBody: string[][];
}

/**
 * 支出・収入一覧
 * @param param0 
 * @returns 
 */
function StatisticsTable({
    tHead,
    tBody,
}: statisticsProps)
{                          
    return <>
        <div className="create-table dis-contents">
            <div className="show-table show-table-statistics">
                <table>
                    <Thead thData={tHead}/>
                    <Tbody tdData={tBody} currency="¥"/>
                </table>
            </div>
        </div>
    </>
}

export default StatisticsTable;