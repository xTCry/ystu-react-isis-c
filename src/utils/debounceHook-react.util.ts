import React from 'react';
import _ from 'lodash';

export const useDebounce = (obj: any = null, wait: number = 1000) => {
    const [state, setState] = React.useState(obj);

    const setDebouncedState = (_val: any) => {
        debounce(_val);
    };

    const debounce = React.useCallback(
        _.debounce((_prop: string) => {
            console.log('updating search');
            setState(_prop);
        }, wait),
        []
    );

    return [state, setDebouncedState];
};
