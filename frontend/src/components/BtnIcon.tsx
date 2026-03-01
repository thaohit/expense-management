import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * 
 * @param param0 s
 * @returns 
 */
function BtnIcon({ drops = true, style = "small", children}: any) {

    return <>
        {
            drops ? 
                <div className="btn-icon">
                    <span><AddIcon fontSize={style}/></span>
                    <span><DeleteIcon fontSize={style}/></span>
                </div> 
            :
            <div className="btn-icon">
                {children}
            </div> 
        }
    </>;
}


export default BtnIcon;