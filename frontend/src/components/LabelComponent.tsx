
type LabelComponentType = {
    text: string
}

function LabelComponent({ text }: LabelComponentType): React.ReactNode
{
    return <>
        <label>{text}</label>
    </>
}

export default LabelComponent