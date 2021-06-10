import { Point } from 'chart.js';
import { RegressionType } from '../../../utils/formulas.util';
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
    'SET_SIGMA_MULT',
    'SET_REGRESSION_TYPE'
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
    regressionData: { [K in RegressionType]?: { r2: number; points2: Point[] } };
    prediction: number;
    smoothLevel: number;
    sigmaMult: number;
    regressionType: RegressionType;
}
