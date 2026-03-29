
type DatasType = {
    category_id: number,
    category_name: string,
}

type CategorySelectListProps = {
    datas: DatasType[];
    defaultDataId?: number
    handleChoose: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function CategorySelectList ({datas, defaultDataId, handleChoose}: CategorySelectListProps)
{

    return (
        <select name="category-select-list" className="category-select-list" onChange={handleChoose} defaultValue={defaultDataId}>
                    <option key={0} value={0}>Choose Category</option>
            {
                datas.map((value, index) => (
                    <option key={value.category_id} value={value.category_id}>{value.category_name}</option>
                ))
            }
        </select>
    );
}

export default CategorySelectList