
const DashboardCard = ({card}) => {

  return (
    <div className="flex items-center rounded justify-between md:justify-evenly p-3 h-[77px] w-full md:w-[196px] bg-primary/20 border border-primary/40">
        <div>
            <p>{card.title}</p>
            <p className="font-bold text-xl">{card.value}</p>
        </div>
        <card.icon />
    </div>
  )
}

export default DashboardCard