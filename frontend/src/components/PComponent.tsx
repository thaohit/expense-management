type Props = {
    val?: string
}

function PComponent({val}: Props = { val: ""})
{
    return <p>{val}</p>
}


export default PComponent;