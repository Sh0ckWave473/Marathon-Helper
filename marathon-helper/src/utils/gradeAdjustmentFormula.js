// Minetti's Cost Formula Given Grade
// Minetti et al. https://pubmed.ncbi.nlm.nih.gov/12183501/
export function gradeAdjustmentFormula(grade) {
    const minettiFactor =
        155.4 * Math.pow(grade, 5) -
        30.4 * Math.pow(grade, 4) -
        43.3 * Math.pow(grade, 3) +
        46.3 * Math.pow(grade, 2) +
        19.5 * grade +
        3.6;
    return minettiFactor;
}
