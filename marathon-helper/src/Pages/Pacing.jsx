import PaceChart from "../charts/PaceChart";
import PaceCalculator from "../components/PaceCalculator";
import RoutePanel from "../components/RoutePanel";
import TipsPanel from "../components/TipsPanel";
export default Pacing;

function Pacing() {
    return (
        <div className="flex flex-col lg:flex-row p-4">
            <div className="flex-1">
                <PaceCalculator />
                <PaceChart />
            </div>
            <div className="flex-1">
                <RoutePanel />
            </div>
            {/* <TipsPanel category="pacing" /> */}
        </div>
    );
}
