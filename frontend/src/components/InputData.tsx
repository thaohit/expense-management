
import '../css/inputdata.css';

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import BtnIcon from './BtnIcon';
import { useState } from 'react';

function InputData() 
{
    const [day, setDay] = useState<string>("1");
    const [category, setCategory] = useState<string>("Eat");
    const [money, setMoney] = useState<string>("10000");
    const [note, setNote] = useState<string>("Khong gi");

    return <>
        <div className="input-data-body">
            <div className="input-data-show border-1p">
                <span className="input-data-show-box">Mục đã nhập </span>
                <div className="input-data-show-day input-data-show-box">
                    <span className="day-box">Ngày</span>
                    <span>{day}</span>
                </div>
                <div className="input-data-show-category input-data-show-box">
                    <span className="day-box">Mục</span>
                    <span>{category}</span>
                </div>
                <div className="input-data-show-money input-data-show-box">
                    <span className="day-box">Số tiền </span>
                    <span>{money}</span>
                </div>
                <div className="input-data-show-note input-data-show-box">
                    <span className="day-box">Ghi chú </span>
                    <span>{note}</span>
                </div>
            </div>
            <div className="input-data-hanlde border-1p">
                <div className="input-data-handle-category">
                    <span>Muc</span>
                </div>
                <div className="input-data-handle-box">
                    <input type="text" />
                </div>
                <div className="input-data-handle-btn">
                    <span><ArrowCircleLeftIcon /></span>
                    <span><ArrowCircleRightIcon /></span>
                </div>
            </div>
            <div className="hidden-btn">
                    <KeyboardDoubleArrowUpIcon />
            </div>
        </div>
    </>;
}


export default InputData;