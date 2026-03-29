
type CategoryTableBody = {
    category_id: number,
    category_name: string,
};

type CategoryTableProps = {
    mode?: number;                   // 0:表示のみ, 1:編集, 2:削除
    title?: string[];                // tableの先頭の行
    body: CategoryTableBody[];      // tableのデータ
    handleOnClick?: (category_id: number, catagory_name: string) => void; //行を選択する処理
    handleCheckboxCategory?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * 
 * @param mode  0:表示のみ, 1:編集, 2:削除
 * @param title tableの先頭の行
 * @param body  tableのデータ
 * @returns 
 */
function CategoryTable({
    mode = 0,
    title = [],
    body = [],
    handleOnClick,
    handleCheckboxCategory,
}:CategoryTableProps): React.ReactNode
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
                           {mode === 1 ? <th></th> : null} 
                            <th>No </th>
                            <th>Category</th>
                        </>}
                    </tr>
                </thead>
                <tbody>
                    {body.length > 0 ?
                        body.map((value:CategoryTableBody, index:number) => (
                            <tr key={value.category_id} onClick={() => {
                                if(handleOnClick) {
                                    handleOnClick(value.category_id, value.category_name);
                                }
                            }}>
                                {mode === 1 ?
                                    <td>
                                    <input type="checkbox"
                                        name="category-checkbox"
                                        onChange={(e) => {
                                            if (handleCheckboxCategory) {
                                                handleCheckboxCategory(e);
                                            }
                                        }}
                                        value={value.category_id}
                                    />
                                    </td>
                                        : null
                                }
                                <td>{index + 1}</td>
                                <td>{value.category_name}</td>
                            </tr>
                        )) :
                        <>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                    </>
                    }
                </tbody>
            </table>
        </div> 
    </>;
}

export default CategoryTable;