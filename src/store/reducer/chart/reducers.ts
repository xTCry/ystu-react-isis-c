import { createReducer } from '../reducer.utils';
import { ChartActionsList, ChartState } from './types';

const initialState: ChartState = {
    csvData: [],
    xxx: '',
};

export const chartReducer = createReducer(initialState, {
    [ChartActionsList.SET_CSV_DATA]: (state, { csvData }) => ({ ...state, csvData }),
    [ChartActionsList.CHANGE_XXX]: (state, { xxx }) => ({ ...state, xxx }),
});
