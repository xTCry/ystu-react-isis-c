import React from 'react';
import { Point } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import * as chartActions from '../store/reducer/chart/actions';

type CtxVal = {
    chartData: Point[];
    setChartData: React.Dispatch<React.SetStateAction<Point[]>>;
};

export const ChartDataContext = React.createContext<CtxVal>(null);

export const ChartDataProvider = (props) => {
    const { children } = props;

    const dispatch = useDispatch();
    const chartData = useSelector((state) => state.chart.chartData);
    const setChartData = React.useCallback((chartData) => dispatch(chartActions.setChartData(chartData)), [dispatch]);

    const value = { chartData, setChartData };

    return <ChartDataContext.Provider value={value} children={children} />;
};

export const useChartData = () => {
    const context = React.useContext<CtxVal>(ChartDataContext);
    if (context === undefined) {
        throw new Error('useChartData must be used within a ChartDataProvider');
    }
    return context;
};

export const ChartDataConsumer =
    (Component) =>
    (props = {}) =>
        (
            <ChartDataContext.Consumer>
                {(context) => (
                    <Component chartData={context.chartData} setChartData={context.setChartData} {...props}></Component>
                )}
            </ChartDataContext.Consumer>
        );
