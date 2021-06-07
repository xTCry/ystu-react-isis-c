import React from 'react';
import { Chart, ChartData } from 'chart.js';

import merge from 'lodash/merge';
import assign from 'lodash/assign';

type Props = {
    data: { labels: any[]; datasets: any[] } | Function;
    options?: any;
    plugins?: any;
    [key: string]: any;
};

const ChartComponent = React.forwardRef<Chart | undefined, Props>((props, ref) => {
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

    React.useImperativeHandle<Chart | undefined, Chart | undefined>(ref, () => chart, [chart]);

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
        console.log('chart.destroy', chart);
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
        if (redraw) {
            destroyChart();
            setTimeout(() => {
                renderChart();
            }, 0);
        } else {
            updateChart();
        }
    }, [props, computedData]);

    return (
        <canvas
            {...rest}
            height={height}
            width={width}
            ref={canvas}
            id={id}
            className={className}
            // onClick={onClick}
            data-testid="canvas"
            role="img"
        >
            {fallbackContent}
        </canvas>
    );
});

export { Chart };

export default ChartComponent;
