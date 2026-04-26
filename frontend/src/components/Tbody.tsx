

interface TbodyType {
    tdData?: string[][];
}

/**
  * tdbody表示
  * @param tdData
  * @returns 
  */
function Tbody({ tdData }: TbodyType)
{

    return <>
        <tbody>
            {tdData && tdData.map((value, index) => (
                <tr key={index}>
                    {value.map((data, item) => (
                        <td key={item}>{data}</td>
                    ))}
                </tr>
            ))}

        </tbody>
    </>
}

export default Tbody;