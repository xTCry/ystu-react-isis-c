import React from 'react';
import { Tooltip, defaults } from 'chart.js';
import { Line, Chart } from 'react-chartjs-2';
import { LineWithErrorBarsController as ErrorBarsController } from 'chartjs-chart-error-bars';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartRegressions } from 'chartjs-plugin-regression';

import * as formulasUtil from '../../utils/formulas.util';

Chart.register(ErrorBarsController, zoomPlugin, ChartRegressions);
// defaults.animation = false;

export const Variant7 = (props: { data: { x: number; y: number }[] }) => {
    const csvDataP = props.data;

    const chart = React.useRef(null);

    const [sigmaMult] = React.useState(3);

    const [csvData, setCsvData] = React.useState(csvDataP);
    const [yArr, setYArr] = React.useState(csvDataP.map((e) => e.y));

    const [std, set_std] = React.useState(formulasUtil.stdCalc(yArr));
    const [std20, set_std20] = React.useState(formulasUtil.stdCalc(yArr.slice(0, 20)));

    const [roman, set_roman] = React.useState(formulasUtil.Roman(yArr.slice(0, 20), std20));
    const [sigma, set_sigma] = React.useState(formulasUtil.Sigma(yArr, std, sigmaMult));

    const onKek = React.useCallback(() => {
        chart.current.options.plugins.legend.position = 'right';
        chart.current?.update();
    }, []);

    React.useEffect(() => {
        const yArr = csvDataP.map((e) => e.y);
        setYArr(yArr);
        
        set_std(formulasUtil.stdCalc(yArr));
        set_std20(formulasUtil.stdCalc(yArr.slice(0, 20)));

        set_roman(formulasUtil.Roman(yArr.slice(0, 20), std20));
        set_sigma(formulasUtil.Sigma(yArr, std));

        setCsvData(csvDataP);
        // console.log('upd csvData');
        chart.current?.update();
    }, [csvDataP, setCsvData]);

    const [responsive, setResponsive] = React.useState(true);

    const mode = 'x';
    const options = {
        responsive,
        interaction: {
            mode,
            intersect: false,
        },

        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode,
                    onPanComplete({ chart }) {
                        chart.update();
                    },
                },
                zoom: {
                    mode,
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    onZoomComplete({ chart }) {
                        chart.update();
                    },
                },
                limits: {
                    // y: {
                    //     max: 20,
                    //     min: 20,
                    // },
                    x: {
                        minRange: 2,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    footer: (items) => {
                        let okArr = [];
                        for(const item of items) {
                            if (typeof item.raw !== 'object') {
                                continue;
                            }
                            
                            okArr.push(item.raw?.isOk);
                        }
                        return `Okkays: ${okArr.join(', ')}`;
                    },
                    label(item) {
                        const base = (Tooltip as any).defaults.callbacks.label.call(this, item);
                        const v = item.chart.data.datasets[item.datasetIndex].data[item.dataIndex] as any;

                        return `${base}${v.beta ? ` (Beta: ${v.beta})` : ''}`;
                    }
                },
            },
        },
        animations: {
            /* y: {
                easing: 'easeInOutElastic',
                from: (ctx) => {
                    if (ctx.type === 'data') {
                        if (ctx.mode === 'default' && !ctx.dropped) {
                            ctx.dropped = true;
                            return 0;
                        }
                    }
                },
            }, */
        },
    };

    const labels = csvData.map((e) => e.x);
        
    const overwriteData = 'all' || true;
    const NUM_NORMAL_ELEMS = labels.length;
    const NUM_ELEMS_PREDICT = NUM_NORMAL_ELEMS + 33;

    const numElems = overwriteData ? NUM_ELEMS_PREDICT : NUM_NORMAL_ELEMS;

    let lastLabel = null;
    const smartLabesls = new Array(numElems).fill(null).map((v, i) => {
        if (i == NUM_NORMAL_ELEMS) {
            lastLabel = Number(labels[i - 1]) - i + 1;
        }
        return i < labels.length ? Number(labels[i]) : lastLabel + Number(i);
    });

    const generateData = (numElems, tempData) =>
        new Array(numElems).fill(0).map((v, i) => (i >= NUM_NORMAL_ELEMS ? null : tempData[i].y));

    const newData = generateData(numElems, csvData);

    const chartType = 'bar'; //'line'
    const isBarChart = chartType == 'bar';

    // ******

    const createSmoothData = (data, smoothValue = 3) => {
        let result = [data[0]];
        for (let i = 1; i < data.length - 2; i += smoothValue) {
            const { x } = data[i];
            const y = data.slice(i, i + smoothValue)
                .map((e) => e.y)
                .reduce((a, b) => a + b) / smoothValue;
            result.push({ x, y });
        }
        result.push(data[data.length - 1]);
        return result;
    };

    const ys_smooth = createSmoothData(csvData);

    const isDownOrUp = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    const isOkkay = (ctx) =>
        ctx.p0.$context?.raw?.isOk === false || ctx.p1.$context?.raw?.isOk === false ? 'yellow' : undefined;

    const dataRomanAndSigma = {
        labels: smartLabesls,
        datasets: [
            // Roman
            {
                type: ErrorBarsController.id,
                label: '# of Years (Roman)',
                data: roman.map((e) => ({
                    ...e,
                    yMin: e.y - e.beta,
                    yMax: e.y + e.beta,
                })),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',

                segment: {
                    // borderColor: (ctx) => isDownOrUp(ctx, 'rgb(192,75,75)'),
                    borderColor: isOkkay,
                },
                // tension: 0.5,
            },
            {
                // type: 'line',
                label: '# of Years (Roman +)',
                data: roman.map((e) => e.y + e.beta),
                fill: false,
                backgroundColor: 'rgb(255, 99, 140, 0.5)',
                borderColor: 'rgba(255, 99, 140, 0.2)',
                tension: 0.5,
            },
            {
                // type: 'line',
                label: '# of Years (Roman -)',
                data: roman.map((e) => e.y - e.beta),
                fill: 1,
                backgroundColor: 'rgb(20, 90, 110, 0.5)',
                borderColor: 'rgba(20, 90, 110, 0.2)',
                tension: 0.5,
            },

            // Sigma
            {
                type: ErrorBarsController.id,
                label: '# of Years (Sigma)',
                data: sigma.map((e) => ({
                    ...e,
                    yMin: e.y - e.beta,
                    yMax: e.y + e.beta,
                })),
                fill: false,
                backgroundColor: 'rgb(100, 180, 150)',
                borderColor: 'rgba(100, 150, 140, 0.2)',
                segment: {
                    borderColor: isOkkay,
                },

                options: {
                    errorBarColor: ['red', 'green'],
                },
            },
            {
                // type: 'line',
                label: '# of Years (Sigma +)',
                data: sigma.map((e) => e.y + e.beta),
                fill: '-1',
                // fill: { above: 'blue', below: 'red', target: { value: std } },
                backgroundColor: 'rgb(10, 80, 80, 0.2)',
                borderColor: 'rgba(20, 90, 800, 0.2)',
                tension: 0.1,
            },

            // regressions
            {
                label: 'ys (full)',
                data: newData,
                fill: false,
                // showLine: isBarChart,
                borderColor: 'rgba(120,120,120,1)',
                backgroundColor: 'rgba(120,120,120,0.5)',

                regressions: {
                    type: ['linear', 'exponential', 'polynomial'],
                    line: { color: 'blue', width: 3 },
                    extendPredictions: true,
                    sections: [
                        {
                            endIndex: NUM_NORMAL_ELEMS - 1,
                            line: { color: 'red' }
                        },
                        {
                            type: 'copy',
                            copy: { fromSectionIndex: 0, overwriteData },
                            startIndex: NUM_NORMAL_ELEMS - 1
                        }
                    ]
                },
            },

            {
                label: 'ys (smooth=3)',
                data: ys_smooth,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'green',
                tension: 0.5,
            },
        ],
    };

    return (
        <>
            <button onClick={() => setResponsive(!responsive)}>Toggle responsive</button>
            <button onClick={() => onKek()}>KEK+</button>
            <hr />
            <pre>
                std = <b>{std}</b>
                <br />
                std * {sigmaMult} = <b>{std * sigmaMult}</b>
            </pre>
            {/* <Line type="line" data={data2} options={options} /> */}

            <h1>romanOf & sigma</h1>
            <Line ref={chart} type="line" plugins={[ChartRegressions]} data={dataRomanAndSigma} options={options} />
            <hr />

            {/* <ChartComponent ref={chart} type={ErrorBarsController.id} data={dataRomanAndSigma} options={options} /> */}

            {/* <h1>sigma</h1>
            <ChartComponent type={ErrorBarsController.id} data={dataSigma} options={options} />
            <hr /> */}
        </>
    );
};;
