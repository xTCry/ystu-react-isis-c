import React from 'react';
import _ from 'lodash';

export const useDebounceState = <S>(
    obj: S | (() => S) = null,
    wait: number = 1000
): [S, React.Dispatch<React.SetStateAction<S>>] => {
    const [state, setState] = React.useState(obj);

    const setDebouncedState = (_val: any) => {
        debounce(_val);
    };

    const debounce = React.useCallback(
        _.debounce((_prop: S) => {
            setState(_prop);
        }, wait),
        []
    );

    return [state, setDebouncedState];
};

export const useDebounceCallback = <S>(
    callback: React.Dispatch<React.SetStateAction<S>>,
    wait: number = 1000,
    deps: React.DependencyList = [],
): React.Dispatch<React.SetStateAction<S>> => {
    const setDebouncedState = (_val: any) => {
        debounce(_val);
    };

    const debounce = React.useCallback(
        _.debounce((_prop: S) => {
            callback(_prop);
        }, wait),
        deps
    );

    return setDebouncedState;
};

export const useDebounceEffect = <S>(
    callback: React.Dispatch<React.SetStateAction<S>>,
    wait: number = 1000,
    deps: React.DependencyList = [],
    state: S = null,
) => {
    const debounceCallback = useDebounceCallback(callback, wait, []);

    React.useEffect(() => {
        debounceCallback(state);
    }, deps);
};
