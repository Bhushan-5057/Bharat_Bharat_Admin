import RecentBearers from "../RecentCard/RecentBearers"
import RecentCard from "../RecentCard/RecentCard"


const OverviewSection = () => {

  return (
      <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
        <div className="w-full md:w-1/2 p-4 rounded-md border mt-2 bg-white dark:bg-black dark:text-white">
          <h2 className="text-xl font-semibold mb-2">Bearers</h2>
          <RecentBearers />
        </div>

        <div className="w-full md:w-1/2 p-4 rounded-md border mt-2 bg-white dark:bg-black dark:text-white">
          <h2 className="text-xl font-semibold mb-2">Recent Events</h2>
         <RecentCard />
        </div>
      </div>
  )
}

export default OverviewSection
