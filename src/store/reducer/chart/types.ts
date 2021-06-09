import { Point } from 'chart.js';
import { applyPrefix } from '../reducer.utils';

export const ChartActionsList = applyPrefix(
    {
        prefix: 'chart/',
    },
    'SET_CSV_DATA',
    'CHANGE_XXX'
);

// Main state
export interface ChartState {
    csvData: Point[];
    xxx: string;
}
