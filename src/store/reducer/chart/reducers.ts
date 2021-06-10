import store2 from 'store2';
import { createReducer } from '../reducer.utils';
import { ChartActionsList, ChartState } from './types';
import { RegressionType } from '../../../utils/formulas.util';

export const saveChartData = (chartData: any[]) =>
    store2('chart_data', JSON.stringify({ time: chartData.length > 0 ? Date.now() : 0, chartData }));
export const loadChartData = () => {
    try {
        const { time, chartData } = JSON.parse(store2('chart_data'));
        if (Array.isArray(chartData)) return { time, chartData };
    } catch (err) {}
    return { time: 0, chartData: [] };
};

const { time: timeSaving, chartData } = loadChartData();
const initialState: ChartState = {
    fileName: null,
    csvData: [],
    saved: 0,
    restored: timeSaving,
    chartData,
    prevChartData: [],
    nextChartData: [],
    regressionData: {},
    prediction: 5,
    smoothLevel: 2,
    sigmaMult: 3,
    regressionType: RegressionType.Linear,
};

const historyLimit = 20;
export const chartReducer = createReducer(initialState, {
    [ChartActionsList.SET_FILENAME]: (state, { fileName }) => ({ ...state, fileName }),
    [ChartActionsList.LOAD_CSV_DATA]: (state, { csvData }) => ({ ...state, csvData, restored: 0, saved: Date.now() }),
    [ChartActionsList.SET_SAVED]: (state, { saved }) => ({ ...state, saved: saved ? Date.now() : 0 }),
    [ChartActionsList.ON_CLOSE]: (state) => ({
        ...state,
        fileName: null,
        saved: 0,
        restored: 0,
        csvData: [],
        chartData: [],
        prevChartData: [],
        nextChartData: [],
        regressionData: {},
    }),
    [ChartActionsList.SET_CHART_DATA]: (state, { chartData }) => ({
        ...state,
        chartData,
        saved: 0,
        prevChartData: [state.chartData, ...state.prevChartData.slice(0, historyLimit - 1)],
        nextChartData: [],
    }),
    [ChartActionsList.PREV_CHART_DATA]: (state) => {
        const [chartData, ...prevChartData] = state.prevChartData;
        saveChartData(chartData);
        return {
            ...state,
            chartData,
            saved: 0,
            prevChartData,
            nextChartData: [state.chartData, ...state.nextChartData.slice(0, historyLimit - 1)],
        };
    },
    [ChartActionsList.NEXT_CHART_DATA]: (state) => {
        const [chartData, ...nextChartData] = state.nextChartData;
        saveChartData(chartData);
        return {
            ...state,
            chartData,
            saved: 0,
            prevChartData: [state.chartData, ...state.prevChartData.slice(0, historyLimit - 1)],
            nextChartData,
        };
    },
    [ChartActionsList.SET_REGRESSION_DATA]: (state, { regressionData }) => ({ ...state, regressionData, saved: 0 }),
    [ChartActionsList.ACTION_CHART_DATA]: (state, { action, data }) => {
        // TODO: hook this chart.js listenArrayEvents
        // https://github.com/chartjs/Chart.js/blob/96dd2010288e674b889023866d595e584f1ae875/src/helpers/helpers.collection.js#L78

        // state.chartData.push({ x: 1, y: 10 });
        return { ...state, chartData: state.chartData, saved: 0 };
    },
    [ChartActionsList.SET_PREDICTION]: (state, { prediction }) => ({ ...state, prediction, saved: 0 }),
    [ChartActionsList.SET_SMOOTH_LEVEL]: (state, { smoothLevel }) => ({ ...state, smoothLevel }),
    [ChartActionsList.SET_SIGMA_MULT]: (state, { sigmaMult }) => ({ ...state, sigmaMult }),
    [ChartActionsList.SET_REGRESSION_TYPE]: (state, { regressionType }) => ({ ...state, regressionType }),
});
