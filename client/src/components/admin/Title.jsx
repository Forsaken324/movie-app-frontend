
const Title = ({title}) => {
    const titleArray = title.split(' ');
  return (
    <div className="flex gap-1 text-2xl font-medium">
        <h2>{titleArray[0]} <span className="text-primary underline">{titleArray[1]}</span></h2>
        
    </div>
  )
}

export default Title