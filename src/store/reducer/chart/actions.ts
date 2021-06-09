import { saveChartData } from './reducers';
import { ChartActionsList } from './types';

export const setFileName = (fileName) => {
    return {
        type: ChartActionsList.SET_FILENAME,
        fileName,
    };
};

export const loadCsvData = (csvData) => {
    return {
        type: ChartActionsList.LOAD_CSV_DATA,
        csvData,
    };
};

export const close = () => {
    saveChartData([]);
    return {
        type: ChartActionsList.ON_CLOSE,
    };
};

export const setSaved = (saved) => {
    return {
        type: ChartActionsList.SET_SAVED,
        saved,
    };
};

export const setChartData = (chartData) => {
    saveChartData(chartData);
    return {
        type: ChartActionsList.SET_CHART_DATA,
        chartData,
    };
};

export const prevChartData = () => {
    return {
        type: ChartActionsList.PREV_CHART_DATA,
    };
};

export const nextChartData = () => {
    return {
        type: ChartActionsList.NEXT_CHART_DATA,
    };
};

export const setRegressionData = (regressionData) => {
    return {
        type: ChartActionsList.SET_REGRESSION_DATA,
        regressionData,
    };
};

export const actionChartData = (action, data) => {
    return {
        type: ChartActionsList.ACTION_CHART_DATA,
        action,
        data,
    };
};

export const setPrediction = (prediction) => {
    return {
        type: ChartActionsList.SET_PREDICTION,
        prediction,
    };
};

export const setSmoothLevel = (smoothLevel) => {
    return {
        type: ChartActionsList.SET_SMOOTH_LEVEL,
        smoothLevel,
    };
};

export const setSigmaMult = (sigmaMult) => {
    return {
        type: ChartActionsList.SET_SIGMA_MULT,
        sigmaMult,
    };
};
