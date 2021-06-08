import React from 'react';
import { Chart, ChartData, Point, Tooltip } from 'chart.js';
import 'react-chartjs-2';
import { LineWithErrorBarsController as ErrorBarsController } from 'chartjs-chart-error-bars';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartRegressions } from 'chartjs-plugin-regression';

import * as formulasUtil from '../../utils/formulas.util';
import ChartComponent from '../Chart.component';

Chart.register(ErrorBarsController, zoomPlugin, ChartRegressions);

const useChartData = ({
    data: csvDataP,
    prediction: predictionP,
    smoothLevel: smoothLevelP,
}: {
    data: Point[];
    prediction?: number;
    smoothLevel?: number;
}) => {
    const [sigmaMult] = React.useState(3);

    const [csvData, setCsvData] = React.useState(csvDataP);
    const [dataPredictionLength, setDataPredictionLen] = React.useState(csvData.length + (predictionP || 0));
    const [smoothLevel, setSmoothLevel] = React.useState(smoothLevelP);

    const [yArr, setYArr] = React.useState([]);
    const [std, set_std] = React.useState(0);
    const [std20, set_std20] = React.useState(0);

    const [roman, set_roman] = React.useState([]);
    const [sigma, set_sigma] = React.useState([]);

    const [newData, setNewData] = React.useState([]);
    const [smartLabels, setSmartLabels] = React.useState([]);
    const [smoothDataY, setSmoothDataY] = React.useState([]);

    React.useEffect(() => {
        setYArr(csvDataP.map((e) => e.y));
        setCsvData(csvDataP);
    }, [csvDataP, setCsvData]);

    React.useEffect(() => {
        set_std(formulasUtil.stdCalc(yArr));
        set_std20(formulasUtil.stdCalc(yArr.slice(0, 20)));
    }, [yArr]);

    React.useEffect(() => {
        set_roman(formulasUtil.Roman(yArr.slice(0, 20), std20));
    }, [std20]);
    React.useEffect(() => {
        set_sigma(formulasUtil.Sigma(yArr, std));
    }, [std]);

    React.useEffect(() => {
        const dataPredictionLength = csvData.length + predictionP;
        setNewData(new Array(dataPredictionLength).fill(0).map((v, i) => (i >= dataLength ? null : csvData[i].y)));

        let lastLabel = null;
        setSmartLabels(
            new Array(dataPredictionLength).fill(null).map((v, i) => {
                if (i == dataLength) {
                    lastLabel = Number(labels[i - 1]) - i + 1;
                }
                return i < labels.length ? Number(labels[i]) : lastLabel + Number(i);
            })
        );

        setDataPredictionLen(dataPredictionLength);
    }, [csvData, predictionP, setDataPredictionLen]);


    React.useEffect(() => {
        setSmoothDataY(formulasUtil.createSmoothData(csvData, smoothLevelP));

        setSmoothLevel(smoothLevelP);
    }, [csvData, smoothLevelP, setSmoothDataY]);

    const labels = csvData.map((e) => e.x);

    const dataLength = csvData.length;

    return {
        newData,
        dataLength,
        dataPredictLength: dataPredictionLength,
        smartLabels,
        smoothDataY,
        smoothLevel,

        sigmaMult,
        csvData,
        std,
        std20,
        roman,
        sigma,
    };
};

export const Variant7 = (props: {
    data: Point[];
    prediction?: number;
    smoothLevel?: number;
    overwriteData?: 'all' | 'none' | 'last';
    regressionsTypes: any;
    isDisplayAllRegressionsTypes: boolean;
    chart: any;
}) => {
    const [responsive, setResponsive] = React.useState(true);

    const {
        newData,
        dataLength,
        dataPredictLength,
        smartLabels,
        smoothDataY,
        sigmaMult,
        csvData,
        std,
        std20,
        roman,
        sigma,
    } = useChartData(props);

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
                        for (const item of items) {
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
                    },
                },
            },
            regressions: {
                // onCompleteCalculation: (c) => props.onRegressionResults?.(c),
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

    const isDownOrUp = (ctx, value) => (ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined);
    const isOkkay = (ctx) =>
        ctx.p0.$context?.raw?.isOk === false || ctx.p1.$context?.raw?.isOk === false ? 'yellow' : undefined;

    const showRegressionsLine = true;
    const regressionDataset: ChartData['datasets'] = !props.isDisplayAllRegressionsTypes
        ? [
              {
                  label: 'ys (full)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(120,120,120,0.8)',
                  backgroundColor: 'rgba(120,120,120,0.3)',

                  regressions: {
                      type: props.regressionsTypes,
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'rgba(255,10,10,0.6)' },
                          },
                          {
                              type: 'copy',
                              copy: { fromSectionIndex: 0, overwriteData: props.overwriteData || 'all' },
                              startIndex: dataLength - 1,
                          },
                      ],
                  },
              },
          ]
        : [
              {
                  label: 'Regression (linear)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(120,120,120,0.8)',
                  backgroundColor: 'rgba(120,120,120,0.3)',

                  regressions: {
                      type: ['linear'],
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'red' },
                          },
                          {
                              type: 'copy',
                              copy: { fromSectionIndex: 0, overwriteData: props.overwriteData || 'all' },
                              startIndex: dataLength - 1,
                          },
                      ],
                  },
              },
              {
                  label: 'Regression (exponential)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(120,120,120,0.8)',
                  backgroundColor: 'rgba(120,120,120,0.3)',

                  regressions: {
                      type: ['exponential'],
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'red' },
                          },
                          {
                              type: 'copy',
                              copy: { fromSectionIndex: 0, overwriteData: props.overwriteData || 'all' },
                              startIndex: dataLength - 1,
                          },
                      ],
                  },
              },
              {
                  label: 'Regression (polynomial)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(120,120,120,0.8)',
                  backgroundColor: 'rgba(120,120,120,0.3)',

                  regressions: {
                      type: ['polynomial'],
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'red' },
                          },
                          {
                              type: 'copy',
                              copy: { fromSectionIndex: 0, overwriteData: props.overwriteData || 'all' },
                              startIndex: dataLength - 1,
                          },
                      ],
                  },
              },
          ];

    const dataRomanAndSigma: ChartData = {
        labels: smartLabels,
        datasets: [
            // Roman
            {
                type: ErrorBarsController.id,
                label: '# of Years (Roman)',
                data: roman.map((e) => ({
                    ...e,
                    yMin: e.y - e.beta,
                    yMax: e.y + e.beta,
                })) as any,
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
                hidden: true,
                type: ErrorBarsController.id,
                label: '# of Years (Sigma)',
                data: sigma.map((e) => ({
                    ...e,
                    yMin: e.y - e.beta,
                    yMax: e.y + e.beta,
                })) as any,
                backgroundColor: 'rgb(100, 180, 150)',
                borderColor: 'rgba(100, 150, 140, 0.2)',
                segment: {
                    borderColor: isOkkay,
                },
            },
            {
                hidden: true,
                label: '# of Years (Sigma +)',
                data: sigma.map((e) => e.y + e.beta),
                fill: '-1',
                // fill: { above: 'blue', below: 'red', target: { value: std } },
                backgroundColor: 'rgb(10, 80, 80, 0.2)',
                borderColor: 'rgba(20, 90, 800, 0.2)',
                tension: 0.1,
            },

            // smooth
            {
                label: `ys (smooth=${props.smoothLevel})`,
                data: smoothDataY,
                showLine: true,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'green',
                tension: 0.5,
            },

            // regressions
            ...regressionDataset,
        ],
    };

    const onKek = React.useCallback(() => {}, []);

    const lineChart = React.useMemo(
        () => <ChartComponent ref={props.chart} plugins={[ChartRegressions]} data={dataRomanAndSigma} options={options} />,
        [dataRomanAndSigma]
    );

    return lineChart;

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

            <h1>romanOf & sigma</h1>
            {lineChart}
            <hr />
        </>
    );
};
