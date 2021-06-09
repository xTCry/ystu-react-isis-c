import React from 'react';
import { usePrevious } from 'react-use';
import { Chart, ChartData } from 'chart.js';

import merge from 'lodash/merge';
import assign from 'lodash/assign';

type Props = {
    data: { labels: any[]; datasets: any[] } | Function;
    options?: any;
    plugins?: any;
    [key: string]: any;
};

const isDeepEqual = (data, prevData) => {
    let eq: any = true;
    if (data === prevData) return true;

    if (data && prevData) {
        if (typeof data === 'object' && typeof prevData === 'object') {
            if (data.constructor !== prevData.constructor) return (eq = 1), eq;

            let length, i, keys;
            if (Array.isArray(data)) {
                length = data.length;
                if (length != prevData.length) return (eq = 2), eq;
                for (i = length; i-- !== 0; )
                    if ((eq = isDeepEqual(data[i], prevData[i]) !== true)) return (eq = eq + 100), eq;
                return (eq = 4), eq;
            }

            if (data.constructor === RegExp)
                return (eq = (data.source === prevData.source && data.flags === prevData.flags) || 5), eq;
            if (data.valueOf !== Object.prototype.valueOf) return (eq = data.valueOf() === prevData.valueOf() || 6), eq;
            if (data.toString !== Object.prototype.toString)
                return (eq = data.toString() === prevData.toString() || 7), eq;

            keys = Object.keys(data);
            length = keys.length;
            if (length !== Object.keys(prevData).length) return (eq = 8), eq;

            for (i = length; i-- !== 0; ) {
                if (!Object.prototype.hasOwnProperty.call(prevData, keys[i])) return (eq = 9), eq;
            }

            for (i = length; i-- !== 0; ) {
                const key = keys[i];

                if (key === '_owner' && data.$$typeof) {
                    // React-specific: avoid traversing React elements' _owner.
                    //  _owner contains circular references
                    // and is not needed when comparing the actual elements (and not their owners)
                    continue;
                }

                if ((eq = isDeepEqual(data[key], prevData[key])) !== true) return (eq = eq + 200), eq;
            }

            return true;
        } else if (typeof data === 'function' && typeof prevData === 'function') {
            if (data.toString === Function.prototype.toString) {
                return (eq = data.toString() === prevData.toString() || 11), eq;
            }
            return true;
        }
    }

    // true if both NaN, false otherwise
    return (eq = (data !== data && prevData !== prevData) || 12), eq;
};

export type ChartDataRef = { chart: Chart | undefined; data: ChartData };

const ChartComponent = React.forwardRef<ChartDataRef, Props>((props, ref) => {
    const {
        type = 'line',
        plugins = [],
        options = {},
        data,
        redraw,

        id,
        className,
        height = 150,
        width = 300,
        fallbackContent,
        ...rest
    } = props;

    const canvas = React.useRef<HTMLCanvasElement>(null);

    const computedData = React.useMemo<ChartData>(() => {
        if (typeof data === 'function') {
            return canvas.current ? data(canvas.current) : {};
        } else {
            return merge({}, data);
        }
    }, [data, canvas.current]);

    const [chart, setChart] = React.useState<Chart>();
    const prevComputedData = usePrevious(computedData);
    const prevOptions = usePrevious(options);

    React.useImperativeHandle<ChartDataRef, ChartDataRef>(
        ref,
        () => ({ chart, data: computedData }),
        [chart, data]
    );

    const renderChart = () => {
        if (!canvas.current) return;

        setChart(
            new Chart(canvas.current, {
                type,
                data: computedData,
                options,
                plugins,
            })
        );
    };

    const destroyChart = () => {
        if (chart) chart.destroy();
    };

    const updateChart = () => {
        if (!chart) return;

        if (options) {
            chart.options = { ...options };
        }

        if (!chart.config.data) {
            chart.config.data = computedData;
            chart.update();
            return;
        }

        const { datasets: newDataSets = [], ...newChartData } = computedData;

        // copy values
        assign(chart.config.data, newChartData);

        if (!chart.config.data.datasets) {
            chart.config.data.datasets = [];
        } else if (chart.config.data.datasets.length > newDataSets.length) {
            chart.config.data.datasets.length = newDataSets.length;
        }

        for (const datasetIndex in chart.config.data.datasets) {
            const newDataSet = newDataSets[datasetIndex];

            // given the new set, find it's current match
            // const currentDataSet = currentDataSets.find(
            //     (d) => d.label === newDataSet.label && d.type === newDataSet.type
            // );

            const currentDataSet = chart.config.data.datasets[datasetIndex];

            if (!currentDataSet.data) {
                currentDataSet.data = [];
            } else {
                currentDataSet.data.length = newDataSet.data.length;
            }

            // copy in values
            assign(currentDataSet.data, newDataSet.data);

            /* let prevIndex = 0;
            for (let dataIndex = 0; dataIndex < currentDataSet.data.length; ++dataIndex) {
                dataIndex = Number(dataIndex);
                const currentData = currentDataSet.data[dataIndex];

                if (newDataSet.data.length - 1 >= dataIndex && currentData) {
                    if (currentData != newDataSet.data[dataIndex]) {
                        if (dataIndex > 0 && currentData === newDataSet.data[dataIndex - 1]) {
                            
                        }
                    }
                    ++prevIndex;
                } else if () {

                }

                // assign(currentDataSet.data, newDataSet.data);
            } */

            // apply dataset changes, but keep copied data
            assign(currentDataSet, {
                ...currentDataSet,
                ...newDataSet,
            });
        }

        if (chart.config.data.datasets.length < newDataSets.length) {
            const appenDataSets = newDataSets.slice(chart.config.data.datasets.length);
            chart.config.data.datasets.push(...appenDataSets);
        }

        chart.update();
    };

    React.useEffect(() => {
        renderChart();

        return () => destroyChart();
    }, []);

    React.useEffect(() => {
        let eq: any = 'none';
        let eq2: any = 'none';
        if (redraw) {
            destroyChart();
            setTimeout(() => {
                renderChart();
            }, 0);
        } else if (
            (eq = isDeepEqual(JSON.stringify(prevComputedData), JSON.stringify(computedData))) !== true ||
            (eq2 = isDeepEqual(prevOptions, options)) !== true
        ) {
            // console.log('not isDeepEqual eqs', eq, eq2, options);
            updateChart();
        }
    }, [/* props, */ options, redraw, computedData, prevComputedData]);

    return (
        <canvas
            {...rest}
            // height={height}
            // width={width}
            ref={canvas}
            id={id}
            className={className}
            // onClick={onClick}
            // data-testid="canvas"
            // role="img"
        >
            {fallbackContent}
        </canvas>
    );
});

export { Chart };

export default ChartComponent;
