
const Title = ({ title }) => {
    const titleArray = title.split(' ');
    return (
        <h2 className="text-xl font-medium">{titleArray[0]} <span className="text-primary underline">{titleArray[1]}</span></h2>
    )
}

export default Title