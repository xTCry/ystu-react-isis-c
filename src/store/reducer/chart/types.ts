import { Point } from 'chart.js';
import { applyPrefix } from '../reducer.utils';

export const ChartActionsList = applyPrefix(
    {
        prefix: 'chart/',
    },
    'SET_FILENAME',
    'LOAD_CSV_DATA',
    'SET_SAVED',
    'ON_CLOSE',
    'SET_CHART_DATA',
    'PREV_CHART_DATA',
    'NEXT_CHART_DATA',
    'SET_REGRESSION_DATA',
    'ACTION_CHART_DATA',
    'SET_PREDICTION',
    'SET_SMOOTH_LEVEL',
    'SET_SIGMA_MULT'
);

// Main state
export interface ChartState {
    fileName: string;
    csvData: Point[];
    saved: number;
    restored: number;
    chartData: Point[];
    prevChartData: Point[][];
    nextChartData: Point[][];
    regressionData: Point[];
    prediction: number;
    smoothLevel: number;
    sigmaMult: number;
}
