const BlurCircle = ({ className = ''}) => {
  return (
    <div className={`absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl ${className}`}>
    </div>
  )
}

export default BlurCircle;