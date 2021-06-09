import { ChartActionsList } from './types';

export const setCsvData = (csvData) => {
    return {
        type: ChartActionsList.SET_CSV_DATA,
        csvData,
    };
};
