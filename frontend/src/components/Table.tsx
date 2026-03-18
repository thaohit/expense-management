


/**
 * 
 */
type TableBody = {
    day: string,
    category: string,
    money: number,
    note: string
};

type TableProps = {
    title: string[];
    body: TableBody[];
};


/**
 * 
 * @param param0 
 * @returns 
 */
function Table({title = [], body = []}:TableProps)
{

    return <>
        <div className="create-table">
            <table border={1}>
                <thead>
                    <tr>
                        {title.length > 0 ?
                            title.map((value:string, index:number) => (
                                <th key={index}>{value}</th>
                            ))
                        :<>
                            <th>No </th>
                            <th>Category</th>
                        </>}
                    </tr>
                </thead>
                <tbody>
                    {body.length > 0 ?
                        body.map((value:TableBody, index:number) => (
                            <tr key={index}>
                                <td>{value.day}</td>
                                <td>{value.category}</td>
                                <td>{value.money}</td>
                                <td>{value.note}</td>
                            </tr>
                        )) :
                        <>
                            <tr>
                                <td>1</td>
                                <td>Eat</td>
                            </tr>
                    </>
                    }
                </tbody>
            </table>
        </div>
    </>;
}

export default Table;