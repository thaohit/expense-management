import { useEffect, useState } from 'react';

import '../css/btnicon.css';

// MUIのicon
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
// MUIのタイプを取得
import type { SvgIconProps } from '@mui/material';

type BtnIconProps = {
    props?: boolean;                    // propsを渡すか？
    title?: string;                     // icon-barのタイトル
    type?: string;                      // month or year
    style?: SvgIconProps["fontSize"];   // iconのサイズ
    isUpdateData?: boolean;
    handleData?: number[];              // 処理したいデータ
    handleAdd?: () => void;             // 追加ボタンの処理
    handleDel?: (data: number[]) => void;             // 削除ボタンの処理
    handleSave?: (data: number) => void;  // 保存ボタンの処理
    children?: React.ReactNode;
}


/**
 * @param props: boolean;                    // propsを渡すか？ true 任意で設計　false default
 * @param title: number;                     // icon-barのタイトル
 * @param style: SvgIconProps["fontSize"];   // iconのサイズ
 * @param handleAdd: () => void;             // 追加ボタンの処理
 * @param handleDel: () => void;             // 削除ボタンの処理
 * @param handleSave: (data:number) => void;  // 保存ボタンの処理
 * @returns 
 */
function BtnIcon(
    { 
        props = false,
        title = "",
        style = "small",
        handleData = [],
        isUpdateData,
        handleAdd,
        handleDel,
        handleSave,
        children
    }: BtnIconProps):React.ReactNode
{

    const [inputData, setInputData] = useState<string>("");         // 入力値
    const [isAdd, setIsAdd] = useState<boolean>(false);             // 追加ボタン押下状態 true | false
    const [isClickAdd, setIsClickAdd] = useState<boolean>(false);
    // const []

    useEffect(() => {
        setInputData("");
    }, [isUpdateData]);

    return <>
        <div className="icon">
            <div className="icon-area-title"><span>{title}</span></div>
            {!props ?
                <div className="icon-area-input btn-icon">
                    {isAdd ?
                    <>
                        <input 
                            type="text"
                            name="bar-title"
                            className="bar-title"
                            placeholder="2000"
                            value={inputData}
                            style={{width:"100%", height:"80%"}}
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => (setInputData(e.target.value))}
                            />
                    </>
                    : null
                    }
                </div>
                : null
            }
            <div className="add-delete-btn btn-icon">
                {!props ? (
                    <>
                        {isAdd ?
                            <span onClick={() => {
                                if (handleSave) {
                                    handleSave(parseInt(inputData));
                                }
                            }}
                            ><CheckIcon /></span>
                        :
                         null
                        }
                        <span onClick={() => setIsAdd(!isAdd)}>
                            {isAdd ? <CloseIcon fontSize={style}/> : <AddIcon fontSize={style}/>}
                        </span>
                        <span onClick={
                            () => {
                                if(handleDel) {
                                    handleDel(handleData);
                                    return;
                                }
                            }
                        }><DeleteIcon fontSize={style}/></span>
                    </>) : (
                        children
                )}
            </div> 
        </div>
    </>;
}

export default BtnIcon;