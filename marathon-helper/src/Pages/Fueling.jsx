import FuelingCalculator from "../components/FuelingCalculator";
import TipsPanel from "../components/TipsPanel";
export default Fueling;

function Fueling() {
    return (
        <div>
            <h2>Fueling Calculator</h2>
            <FuelingCalculator />
            <TipsPanel category="fueling" />
        </div>
    );
}
