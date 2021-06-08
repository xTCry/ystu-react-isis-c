import React from 'react';
import _ from 'lodash';

export const useDebounce = <S>(obj: S | (() => S) = null, wait: number = 1000): [S, React.Dispatch<React.SetStateAction<S>>] => {
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
