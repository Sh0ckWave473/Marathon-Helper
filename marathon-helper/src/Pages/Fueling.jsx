import FuelingChart from "../charts/FuelingChart";
import FuelingCalculator from "../components/FuelingCalculator";
import TipsPanel from "../components/TipsPanel";
export default Fueling;

function Fueling() {
    return (
        <div className="flex flex-col lg:flex-row p-4">
            <div className="flex-1">
                <FuelingCalculator />
            </div>
            <div className="flex-1">
                <FuelingChart />
            </div>
            {/* <TipsPanel category="fueling" /> */}
        </div>
    );
}
