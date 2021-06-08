import React from 'react';
import { Point } from 'chart.js';

type CtxVal = {
    csvData: Point[];
    setCsvData: React.Dispatch<React.SetStateAction<Point[]>>;
};

export const CsvDataContext = React.createContext<CtxVal>(null);

export const CsvDataProvider = (props) => {
    const { children } = props;

    const [csvData, setCsvData] = React.useState<Point[]>([]);
    const value = { csvData, setCsvData };

    return <CsvDataContext.Provider value={value} children={children} />;
};

export const useCsvData = () => {
    const context = React.useContext<CtxVal>(CsvDataContext);
    if (context === undefined) {
        throw new Error('useCsvData must be used within a CsvDataProvider');
    }
    return context;
};

export const CsvDataConsumer =
    (Component) =>
    (props = {}) =>
        (
            <CsvDataContext.Consumer>
                {(context) => (
                    <Component csvData={context.csvData} setCsvData={context.setCsvData} {...props}></Component>
                )}
            </CsvDataContext.Consumer>
        );
