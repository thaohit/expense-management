import '../css/categorytable.css';

type CategoryTableBody = {
    category_id: number;
    category_name: string;
    category_type: number;
    display: number;
    priority: number;
    note: string;
};

type CategoryTableProps = {
    mode?: number;                      // 0:表示のみ, 1:編集, 2:削除
    title?: string[];                   // tableの先頭の行
    body: CategoryTableBody[];          // tableのデータ
    choosedTarget?: string;              // 入力から選択されたカテゴリID
    isShowDetail?: boolean;             // 詳細表示
    isShowAll?: boolean;                // displayを問わず全て表示 
    handleOnClick?: (data: CategoryTableBody) => void; //行を選択する処理
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
    isShowDetail = false,
    handleOnClick,
    handleCheckboxCategory,
}:CategoryTableProps): React.ReactNode
{

    

    return <>
        <div className="create-table category-list max-width">
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
                            <th className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>Type</th>
                            <th className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>Display</th>
                            <th className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>Priority</th>
                            <th className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>Note</th>
                        </>}
                    </tr>
                </thead>
                <tbody>
                    {body.length > 0 ?
                        body.map((value:CategoryTableBody, index:number) => (
                            <tr 
                                className={choosedTarget && choosedTarget === (index+1).toString() ? "category-table-tr choosed" : "category-table-tr"}
                                key={value.category_id}
                                onDoubleClick={() => {
                                    if(handleOnClick) {
                                        handleOnClick(value);
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
                                <td className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>{value.category_type === 0 ? "Pay" : "Income"}</td>
                                <td className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>{value.display}</td>
                                <td className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>{value.priority}</td>
                                <td className={`${!isShowDetail ? "display-not-show" : "display-show"}`}>{value.note}</td>
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