import { createStore, applyMiddleware, compose, combineReducers, Action, AnyAction } from 'redux';
import { createBrowserHistory } from 'history';
import { ReducerRegistry } from './reducer/reducer-registry';
import { coreReducers } from './reducer/reducers-core';

const middlewares = [];

const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

const configureStore = <S, A extends Action = AnyAction>(reducerRegistry: ReducerRegistry<S>) => {
    const rootReducer = combineReducers<S, A>(reducerRegistry.getReducers());
    const store = createStore(rootReducer, enhancer);

    reducerRegistry.setChangeListener((reducers) => {
        const newRootReducer = combineReducers<S>(reducers);
        store.replaceReducer(newRootReducer);
    });

    return store;
};

export const reducerRegistry = new ReducerRegistry(coreReducers);

export const store = configureStore(reducerRegistry);
export const getState = store.getState;
export const dispatch = store.dispatch;
export const history = createBrowserHistory();

export type RootState = ReturnType<typeof store['getState']>;

declare module 'react-redux' {
    interface DefaultRootState extends RootState {}
}

export default store;
