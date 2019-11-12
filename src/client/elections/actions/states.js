
import StateFace from './stateface.json';

export const stateFaceOptions = Object.keys(StateFace).map((abbr) => {
    return { 
        abbr,
        displayValue: StateFace[abbr]
    }
});