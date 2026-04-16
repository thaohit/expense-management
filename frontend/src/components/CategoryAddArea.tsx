import { useEffect, useState, type OptionHTMLAttributes, type SelectHTMLAttributes } from 'react';

import '../css/categoryaddarea.css'

// 
import CategoryTable from './CategoryTable';
import BtnIcon from './BtnIcon';


// api
import {
    handleSaveCategory,
    handleGetAllCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleGetListCategoryByYearForTable,
    handleSaveCategoryByYearForTable
} from '../services/api';

type timeType = {
    time_id: number;
    year: number;
    month: number;
}

type selectCategoryFromTableType = {
    category_id: number;
    category_name: string;
    category_type: number;
}

type categoryAddAreaProps = {
    year: number;
    month: number;
    time: timeType;
    isClickMonth: boolean;
}

// 年ごとのカテゴリーリストタイプ
type categoryListByYear = {
    month: number;
    year_name: number;
    time_id: number;
    categoryData: {
        category_id: number;
        category_name: string;
        category_type: number;
    }[];
}
/**
 * 
 * @param year 年
 * @param month 月
 * @param isClickMonth  タイムの選択状態 
 * @returns 
 */
function CategoryAddArea({ year, month, time, isClickMonth }: categoryAddAreaProps): React.ReactNode
{   

    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");                                        // category入力値
    const [categoryType, setCategoryType] = useState<number>(0);                         // 0: 支出, 1: 収入
    const [categoryData, setCategoryData] = useState<selectCategoryFromTableType[]>([]); // category_tableのデータを設定
    const [categoryDataAfterSelect, setCategoryDataAfterSelect] = useState<selectCategoryFromTableType[]>([]);             // カテゴリーリストを選択した後のデータ
    const [checkboxList, setCheckboxList] = useState<string[]>([]);                         //  categories選択リスト
    const [categoryListByYear, setCategoryListByYear] = useState<categoryListByYear[]>([]);
    
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
    const handleSelectCategoryFromTable = (id: number, name: string, type: number) => {
        setId(id);
        setName(name);
        setCategoryType(type);
        if(isEdit === false) {
            setIsEdit(true);
        }
    }

    /**
     * カテゴリ保存処理
     */
    const handleSave = () => {
        
        // タイムが選択されない場合、エラー設定
        if (time.year === 0 && time.month === 0) {
            setIsError(1);
            return;
        }
        // 入力されない場合、エラー設定
        if (name === "") {
            setIsError(2)
            return;
        }

        const setObjForSave = {
            category_name: name,
            category_type: categoryType,
            time_id: time.time_id,
        }
        console.log(setObjForSave);
        const saveData = handleSaveCategory(setObjForSave);
        saveData.then((res) => {
            if (res.success) {
                setIsSave(!isSave);
            }
            console.log(res.mess);
        })
        // 処理後、初期化
        handleInitial();
    }

    /**
     * カテゴリ更新
     */
    const handleEdit = () => {

        // タイムが選択されない場合、エラー設定
        if (time.year === 0 && time.month === 0) {
            setIsError(1);
            return;
        }
        // 入力されない場合、エラー設定
        if (name === "") {
            setIsError(2)
            return;
        }

        const updateCategory = handleUpdateCategory(id, name, 0);
        updateCategory.then((res) => {
            if (res.success) {
                setIsSave(!isSave);
                handleInitial();
            }
            alert(res.mess);
        });
    }

    /**
     * category削除処理
     * @returns void
     */
    const handleDelete = () => {
        
        // 選択されない場合、メッセージを表示する
        if (checkboxList.length <= 0) {
            setIsError(4);
            return;
        }
        const deleteCategory = handleDeleteCategory(checkboxList);
        deleteCategory.then((res) => {            
            // 削除に成功の場合、category tableを更新し、checkboxlist初期化する
            if (res.success) {
                setIsSave(!isSave);
                setCheckboxList([]);
            }
            alert(res.mess);
        });
    }
    
    /**
     * Enter key押下処理
     * * 更新または保存
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

    /**
     * 年ごとのカテゴリーリストを取得するボタンを押下する
     */
    const handleSelectListCategoryForTable = () => {
        
        if (isSelectListCategory === false) {
            setIsSelectListCategory(true);
            
            const getCategoryOfYear = handleGetListCategoryByYearForTable();
            getCategoryOfYear.then((res) => {
                console.log(res);
                if (res) {
                    if (res.data) {
                        setCategoryListByYear(res.data);
                    } else {
                        setCategoryListByYear([]);
                    }
                }
            });
        } else {
            setCategoryDataAfterSelect([]);
            setCategoryListByYear([]);
            setIsSelectListCategory(false);
        }
    }

    /**
     * リストを選択する処理
     * * 選択される場合、該当するカテゴリー表示を変更する
     * @param e 
     */
    const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        categoryListByYear.map((val) => {
            if (val.time_id === parseInt(value)) {
                setCategoryDataAfterSelect(val.categoryData);
            }
        })
    }

    /**
     * 選択を保存
     */
    const handleSaveListCategory = () => {

        if (categoryDataAfterSelect.length <= 0) {
            alert("カテゴリを選択してください");
            return;
        }
        const saveCategory = handleSaveCategoryByYearForTable(categoryDataAfterSelect, time.time_id);
        saveCategory.then((res) => {
            if (res.success) {
                setIsSave(!isSave);
            }
            alert(res.mess);
        });
    }


    useEffect(() => {
    
            let ignore = false; // Clear up

            // カテゴリ一覧取得
            const getCategory = handleGetAllCategory(time.time_id);
            getCategory.then((res) => {
                if (ignore === false) {
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            setCategoryData(res.data);
                        } else {
                            setCategoryData([]);
                        }
                    } else {
                        console.log(res.mess);
                    }
                }
            })

            if (isEdit && name === "") {
                setIsSave(false);
            }
            
            // タイムが選択される時に、初期化
            handleInitial();
            setIsSelectTime(true);
            setCategoryDataAfterSelect([]);

            return () => {ignore = true;}
    
    }, [isSave, isClickMonth]);

    useEffect(() => {
        setIsSelectListCategory(false);
        setCategoryListByYear([]);
    }, [isClickMonth]);

    return <>
        <div className="category-add-area">
            <h3>カテゴリ一覧 {time.year === 0 ? "" : time.year}年{time.month === 0 ? "" : time.month}月</h3>
            <p style={{fontSize: "20px", fontWeight: "bold", color: "red"}}>{errorMessenge[isError]}</p>
            <div className="category-add-body">
                <div className="add-category">
                    <span><p>カテゴリ</p></span>    
                    <input
                        type="text"
                        name="input-add-category"
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
                    <div className="category-radio">
                        <span>支出<input type="radio" value={0} name="radio-expense" checked={categoryType === 0} onChange={() => setCategoryType(0)}/></span>
                        <span>収入<input type="radio" value={1} name="radio-income" checked={categoryType === 1} onChange={() => setCategoryType(1)}/></span>
                    </div>
                    <div className="categore-delete-btn">
                        <button type="button" onClick={handleDelete}>Delete Category</button>
                    </div>
                    <div className="category-select-list-btn">
                        <button type="button" onClick={handleSelectListCategoryForTable}>Select List</button>
                        {isSelectListCategory ?
                            <select name="select-list" onChange={handleSelectCategory}>
                                <option value="">Select month</option>
                                {
                                    categoryListByYear?.map((value) => (
                                        <option
                                            key={value.time_id}
                                            value={value.time_id}
                                        >{value.year_name + "/" + value.month}</option>
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
                        body={isSelectListCategory ? categoryDataAfterSelect : categoryData}
                        handleOnClick={handleSelectCategoryFromTable}
                        handleCheckboxCategory={handleCheckboxCategory}
                    />
                </div>
            </div>
        </div>
    </>
}

export default CategoryAddArea;