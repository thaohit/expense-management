import { useEffect, useState } from 'react';

import '../css/categoryaddarea.css'

// 
import CategoryTable from './CategoryTable';
import BtnIcon from './BtnIcon';


// api
import { handleSaveCategory, handleGetAllCategory, handleUpdateCategory, handleDeleteCategory } from '../services/api';

type timeType = {
    time_id: number;
    year: number;
    month: number;
}
type CategoryProps = {
    no: string;
    category: string;
};

type selectCategoryFromTableType = {
    category_id: number,
    category_name: string
}

type categoryAddAreaProps = {
    year: number;
    month: number;
    time: timeType;
    isClickMonth: boolean;
}

/**
 * 
 * @param year 年
 * @param month 月
 * @param isClickMonth  タイムの選択状態 
 * @returns 
 */
function CategoryAddArea({ year, month, time,  isClickMonth }: categoryAddAreaProps): React.ReactNode
{   

    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [categoryData, setCategoryData] = useState<selectCategoryFromTableType[]>([]); // category_tableのデータを設定
    const [checkboxList, setCheckboxList] = useState<string[]>([]);                         //  categories選択リスト
    const [timeData, setTimeData] = useState<selectCategoryFromTableType[]>([])             // time table data 
    
    const [isEdit, setIsEdit] = useState<boolean>(false);               // 編集モード 0: 編集しない 1:編集する
    const [isSave, setIsSave] = useState<boolean>(true);                // データ保存状態
    const [isInput, setIsInput] = useState<boolean>(true);              // 入力状態
    const [isSelectTime, setIsSelectTime] = useState<boolean>(false);   // タイム選択状態
    const [isError, setIsError] = useState<number>(0);                  // エラー状態 [0, 1, 2, 3, 4]
    const [isSelectListCategory, setIsSelectListCategory] = useState<boolean>(false);

    const [errorMessenge, setErrorMessenge] = useState<string[]>([
        "",
        "Select Month before input data",
        "Save category after input data",
        "Error while handling process. Try again!",
        "Select category you want to delete",
        "Delete Error"
    ]);

    const [styleWhileErrorInput, setStypeWhileErrorInput] = useState<string>("");

    /**
     * 初期化
     * * id 
     * * name
     * * isEdit
     * * isError
     */
    const handleInitial = () => {
        setId(0);
        setName("");
        setIsEdit(false);
        setIsError(0);
    }
    /**
     * カテゴリテーブルからの選択を処理する
     * * setId()
     * * setName()
     * @param id category_id
     * @param name category_name
     */
    const handleSelectCategoryFromTable = (id: number, name: string) => {
        setId(id);
        setName(name);
        if(isEdit === false) {
            setIsEdit(true);
        }
    }

    /**
     * カテゴリ保存処理
     */
    const handleSave = () => {
        
        // タイムが選択されない場合、エラー設定
        if (year === 0 && month === 0) {
            setIsError(1);
            return;
        }
        // 入力されない場合、エラー設定
        if (name === "") {
            setIsError(2)
            return;
        }

        const setObjForSave = {
            name: name,
            year: year,
            month: month
        }
        const saveData = handleSaveCategory(setObjForSave);
        saveData.then((res) => {
            console.log(res);
            if (res.success) {
                if (res.data && res.data.id !== 0) {
                    setIsSave(!isSave);
                    console.log("add category success")
                }
            }
        })
        // 処理後、初期化
        handleInitial();
    }

    /**
     * カテゴリ更新
     */
    const handleEdit = () => {

        // タイムが選択されない場合、エラー設定
        if (year === 0 && month === 0) {
            setIsError(1);
            return;
        }
        // 入力されない場合、エラー設定
        if (name === "") {
            setIsError(2)
            return;
        }

        const updateCategory = handleUpdateCategory(id, name);
        updateCategory.then((res) => {
            console.log(res);
            if (res.success && res.data && res.data.change_num !== 0) {
                setIsSave(!isSave);
                handleInitial();
            } else {
                setIsError(2);
            }
        });
    }

    const handleDelete = () => {
        
        // 選択されない場合、メッセージを表示する
        if (checkboxList.length < 0) {
            setIsError(4);
            return;
        }

        const deleteCategory = handleDeleteCategory(checkboxList);
        deleteCategory.then((res) => {
            console.log(res);
            
            // 削除に成功の場合、category tableを更新し、checkboxlist初期化する
            if (res.success && res.data && res.data.change_num !== 0) {
                setIsSave(!isSave);
                setCheckboxList([]);
            }
        });
    }
    
    /**
     * Enter key押下処理
     * @param event 
     */
    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === "Enter") {
            if (isEdit) {
                handleEdit();
            } else {
                handleSave();
            }
        }
    }

    /**
     * category checkbox 選択処理
     * @param event 
     */
    const handleCheckboxCategory = (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value;
        let checkboxData = checkboxList;
        let positionDataInCheckbox = checkboxData.indexOf(value);

        // 既に選択された場合、選択解除
        if (positionDataInCheckbox !== -1) {
            checkboxData.splice(positionDataInCheckbox, 1);
        } else {
            checkboxData.push(value);
        }

        console.log(checkboxData);
        setCheckboxList(checkboxData);

    }


    const handleSelectListCategoryForTable = () => {
        setIsSelectListCategory(!isSelectListCategory);
    }

    const handleSaveListCategory = () => {

    }


    useEffect(() => {
    
            let ignore = false; // Clear up
    
            const getCategory = handleGetAllCategory(1, year, month);
            getCategory.then((res) => {
                console.log("category", res);
                if (ignore === false) {
                    if (res.success && res.success === true) {
                        if (res.data && res.data.length > 0) {
                            setCategoryData(res.data);
                        }
                    } else {
                        setCategoryData([]);
                    }
                }
            })

            if (isEdit && name === "") {
                setIsSave(false);
            }
            
            // タイムが選択される時に、初期化
            handleInitial();
            setIsSelectTime(true);

            return () => {ignore = true;}
    
    }, [isSave, isClickMonth]);


    return <>
        <div className="category-add-area">
            <h3>カテゴリ一覧 {year === 0 ? "" : year}年{month === 0 ? "" : month}月</h3>
            <p style={{fontSize: "20px", fontWeight: "bold", color: "red"}}>{errorMessenge[isError]}</p>
            <div className="category-add-body">
                <div className="add-category">
                    <span><p>カテゴリ</p></span>    
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={!isInput ?
                            {border: "2px solid red"} :
                            {}
                        }
                        onKeyDown={handleEnterKeyDown}
                        placeholder="Input your category"
                    />
                    {!isEdit ?
                        <button type="button" onClick={handleSave}>{"Save >>"}</button> :
                        <button type="button" onClick={handleEdit}>{"Edit >>"}</button>
                    }
                    <div className="">
                        <span>収入<input type="radio" name="" id="" /></span>
                        <span>支出<input type="radio" name="" id="" /></span>
                    </div>
                    <div className="categore-delete-btn">
                        <button type="button" onClick={handleDelete}>Delete Category</button>
                    </div>
                    <div className="category-select-list-btn">
                        <button type="button" onClick={handleSelectListCategoryForTable}>Select List</button>
                        {isSelectListCategory ?
                            <select name="" id="">
                                <option value="">Select month</option>
                                {
                                    timeData.map((value) => (
                                        <option value={value.category_id}>{value.category_name}</option>
                                    ))
                                }
                            </select>
                            : null
                        }
                        <button onClick={handleSaveListCategory}>Ok</button>
                    </div>
                </div>
                <div className="category-table">
                    <CategoryTable
                        mode={1}
                        body={categoryData}
                        handleOnClick={handleSelectCategoryFromTable}
                        handleCheckboxCategory={handleCheckboxCategory}
                    />
                </div>
            </div>
        </div>
    </>
}

export default CategoryAddArea;