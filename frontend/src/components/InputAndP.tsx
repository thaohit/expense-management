import { useEffect } from "react";

import '../css/expensetable.css';


type Props = { 
    id: number;
    isChange: boolean;
    value: string;
    handleSet: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


/**
 * 
 * @param id
 * @param value
 * @param isChange
 * @param handleSet
 * 
 * @returns 
 */
function InputAndP ({id, value, isChange, handleSet}: Props)
{

    // useEffect(()=> {
    //     console.log("Mount");

    //     return () => {console.log("unmout")};
    // },);

    if (isChange) {
        return <input type="text" style={{textAlign: "center", backgroundColor: "#d1ffd6"}} value={value} className="input-text" onChange={handleSet}/>
    } else {
        return <p>{value}</p>
    }
}

export default InputAndP;