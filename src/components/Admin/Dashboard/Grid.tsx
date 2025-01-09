import ActivityGraph from "./ActivityGraph";
import RecentTransactions from "./RecentTransactions";
import StatsCards from "./StatsCards";
import UsageRadar from "./UsageRadar";

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12 mt-6">
        
      <StatsCards />
      <ActivityGraph/>
      <UsageRadar/>
      <RecentTransactions/>
      
    </div>
  );
};

export default Grid;
