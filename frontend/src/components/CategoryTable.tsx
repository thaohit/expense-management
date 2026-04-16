
type CategoryTableBody = {
    category_id: number;
    category_name: string;
    category_type: number;
};

type CategoryTableProps = {
    mode?: number;                   // 0:表示のみ, 1:編集, 2:削除
    title?: string[];                // tableの先頭の行
    body: CategoryTableBody[];      // tableのデータ
    choosedTarget?: string;              // 入力から選択されたカテゴリID
    handleOnClick?: (category_id: number, category_name: string, category_type: number) => void; //行を選択する処理
    handleCheckboxCategory?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * 
 * @param mode  0:表示のみ, 1:編集, 2:削除
 * @param title tableの先頭の行
 * @param body  tableのデータ
 * @param choosedTarget
 * @returns 
 */
function CategoryTable({
    mode = 0,
    title = [],
    body = [],
    choosedTarget,
    handleOnClick,
    handleCheckboxCategory,
}:CategoryTableProps): React.ReactNode
{  

    return <>
       <div className="create-table category-list">
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
                            <tr 
                                className={choosedTarget && choosedTarget === value.category_id.toString() ? "category-table-tr choosed" : "category-table-tr"}
                                key={value.category_id}
                                onClick={() => {
                                    if(handleOnClick) {
                                        handleOnClick(value.category_id, value.category_name, value.category_type);
                                    }
                                }}
                            >
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