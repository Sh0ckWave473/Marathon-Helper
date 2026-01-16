import { tips } from "../data/tips";
import { useRace } from "../context/useRace.js";

export default TipsPanel;

function TipsPanel({ category }) {
    const categoryTips = tips[category] || [];

    const specificTips = [];
    const { goalTime, gelsPerHour, paceInSeconds } = useRace();

    if (categoryTips.length === 0) {
        return null;
    }

    if (category == "pacing") {
        if (!goalTime || !paceInSeconds) {
            return null;
        } else if (paceInSeconds <= 275) {
            specificTips.push(
                "This may be too fast for most runners (unless you want a marathon WR!). Consider adjusting your goal time."
            );
        } else if (paceInSeconds <= 600) {
            specificTips.push(
                "Great pace! Make sure to stick to your plan and avoid starting too fast."
            );
        } else {
            specificTips.push(
                "Your main focus should be on finishing the marathon so your long runs and overall training should prioritize endurance over speed."
            );
        }
    }

    if (category == "fueling") {
        if (!gelsPerHour) {
            return null;
        } else if (gelsPerHour < 2) {
            specificTips.push(
                "Consider increasing your carbs per hour to meet recommended carbohydrate intake during the marathon."
            );
        } else if (gelsPerHour > 4) {
            specificTips.push(
                "This is a very high gel intake. Make sure to test this fueling strategy during training to avoid gastrointestinal issues."
            );
        } else {
            specificTips.push(
                "Your fueling plan looks solid! Be sure to start early and stick to your schedule during the race."
            );
        }
    }

    return (
        <aside className="bg-slate-950 border-l-4 border-emerald-500 rounded-md p-5 m-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
                {category.charAt(0).toUpperCase() + category.slice(1)} Tips
            </h2>

            {specificTips.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-emerald-700 mb-1">
                        Personalized Insight
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800">
                        {specificTips.map((tip, index) => (
                            <li key={`specific-${index}`}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    General Advice
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {categoryTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
