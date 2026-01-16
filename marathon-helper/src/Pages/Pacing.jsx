import PaceCalculator from "../components/PaceCalculator";
import TipsPanel from "../components/TipsPanel";
export default Pacing;

function Pacing() {
    return (
        <div>
            <h2>Pace Calculator</h2>
            <PaceCalculator />
            <TipsPanel category="pacing" />
        </div>
    );
}
