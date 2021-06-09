import { Action, AnyAction, Reducer } from 'redux';
import { filterActions } from 'redux-ignore';

export const applyPrefix = <K extends keyof any>({ prefix }: { prefix: string }, ...args: K[]): Record<K, string> =>
    args.reduce<any>((prev, key) => ({ ...prev, [key]: `${prefix}${key}` }), {});

const wrapActions = (objActions, fnWrapper) => (state, action) => {
    const fn = objActions[action.type];
    return fn ? (fnWrapper ? fnWrapper(fn(state, action)) : fn(state, action)) : state;
};

export const createReducer = <S, A extends Action = AnyAction>(
    initialState: S,
    objActions: Record<string, Reducer<S, A>>,
    fnWrapper?: any,
): Reducer<S, A> =>
    filterActions<S>(
        (state = initialState, action) => wrapActions(objActions, fnWrapper)(state, action),
        Object.keys(objActions),
    );
