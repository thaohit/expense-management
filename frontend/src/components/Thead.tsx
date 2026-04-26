

interface TheadType {
    thData?: any[];
}

/**
 * thead表示
 * @param thData
 * @returns 
 */
function Thead({ thData }: TheadType)
{
    return <>
        <thead>
            <tr>
                {thData?.map((value, index) => (
                    <th key={index}>{value}</th>
                ))}
            </tr>
        </thead>
    </>
}

export default Thead;