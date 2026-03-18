
type CategoryTableBody = {
    no: string,
    category: string,
};

type CategoryTableProps = {
    title: string[];
    body: CategoryTableBody[];
};

/**
 * 
 * @param param0 
 * @returns 
 */
function CategoryTable({title = [], body = []}:CategoryTableProps)
{  
    return <>
       <div className="create-table catagory-list">
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
                        body.map((value:CategoryTableBody, index:number) => (
                            <tr key={index}>
                                <td>{value.no}</td>
                                <td>{value.category}</td>
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

export default CategoryTable;