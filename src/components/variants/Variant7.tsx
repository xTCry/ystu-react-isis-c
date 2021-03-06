import React from 'react';
import { Chart, ChartData, Tooltip } from 'chart.js';
import 'react-chartjs-2';
import { LineWithErrorBarsController as ErrorBarsController } from 'chartjs-chart-error-bars';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartRegressions } from 'chartjs-plugin-regression';

import ChartComponent from '../Chart.component';
import * as formulasUtil from '../../utils/formulas.util';
import { useSelector } from 'react-redux';

Chart.register(ErrorBarsController, zoomPlugin, ChartRegressions);

export enum DatasetName {
    Original,
    Roman,
    RomanPlus,
    RomanMinus,
    Sigma,
    SigmaPlus,
    Smooth,

    RegressionSmart = 'regressionSmart',
    RegressionLinear = 'regressionLinear',
    RegressionExponential = 'regressionExponential',
    RegressionPolynomial = 'regressionPolynomial',
}

declare module 'chart.js' {
    interface ChartDatasetProperties<TType extends ChartType, TData> {
        name?: DatasetName;
    }
}

export const useChartDataErrors = () => {
    const { chartData, sigmaMult } = useSelector((state) => state.chart);

    const [yArr, setYArr] = React.useState<number[]>([]);
    const [std, set_std] = React.useState(0);
    const [std20, set_std20] = React.useState(0);

    const [roman, set_roman] = React.useState<ReturnType<typeof formulasUtil.Roman>>([]);
    const [sigma, set_sigma] = React.useState<ReturnType<typeof formulasUtil.Sigma>>([]);

    React.useEffect(() => {
        setYArr(chartData.map((e) => e.y));
    }, [chartData]);

    React.useEffect(() => {
        set_std(formulasUtil.stdCalc(yArr));
        set_std20(formulasUtil.stdCalc(yArr.slice(0, 20)));
    }, [yArr]);

    React.useEffect(() => {
        set_roman(formulasUtil.Roman(yArr, true/* , std20 */));
    }, [yArr]);

    React.useEffect(() => {
        set_sigma(formulasUtil.Sigma(yArr, std, sigmaMult));
    }, [std, sigmaMult]);

    return {
        sigmaMult,
        chartData,
        std,
        std20,
        roman,
        sigma,
    };
};

const useChartData = () => {
    const { prediction, smoothLevel, chartData } = useSelector((state) => state.chart);

    const [dataPredictionLength, setDataPredictionLen] = React.useState(chartData.length + (prediction || 0));

    const [newData, setNewData] = React.useState([]);
    const [smartLabels, setSmartLabels] = React.useState([]);
    const [smoothDataY, setSmoothDataY] = React.useState([]);

    const labels = chartData.map((e) => e.x);
    const dataLength = chartData.length;

    React.useEffect(() => {
        const dataPredictionLength = chartData.length + prediction;
        setNewData(new Array(dataPredictionLength).fill(0).map((v, i) => (i >= dataLength ? null : chartData[i].y)));

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
    }, [chartData, prediction, setDataPredictionLen]);

    React.useEffect(() => {
        setSmoothDataY(formulasUtil.createSmoothData(chartData, smoothLevel));
    }, [chartData, smoothLevel, setSmoothDataY]);

    return {
        newData,
        dataLength,
        dataPredictionLength,
        smartLabels,
        smoothDataY,
        smoothLevel,
    };
};

const Variant7 = (props: {
    overwriteData?: 'all' | 'none' | 'last';
    regressionsTypes?: any[];
    isDisplayAllRegressionsTypes?: boolean;
    chart: any;
}) => {
    const { newData, dataLength, smartLabels, smoothDataY, smoothLevel } = useChartData();
    const { sigmaMult, std, roman, sigma } = useChartDataErrors();
    // console.log('redraw char var7');

    const mode = 'x';
    const options = {
        responsive: true,
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

                // TODO: fix this!
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
                  name: DatasetName.RegressionSmart,
                  label: 'ys (full)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(0, 183, 255, 0.2)',
                  backgroundColor: 'rgba(0, 183, 255, 0.3)',

                  regressions: {
                      type: props.regressionsTypes || ['linear'],
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'rgba(255, 0, 119, 0.9)' },
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
                  name: DatasetName.RegressionLinear,
                  label: 'Regression (linear)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(255, 174, 0, 0.1)',
                  backgroundColor: 'rgba(255, 174, 0, 0.3)',

                  regressions: {
                      type: ['linear'],
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'rgba(255, 174, 0, 0.9)' },
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
                  name: DatasetName.RegressionExponential,
                  label: 'Regression (exponential)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(0, 145, 255, 0.1)',
                  backgroundColor: 'rgba(0, 145, 255, 0.3)',

                  regressions: {
                      type: ['exponential'],
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'rgba(0, 145, 255, 0.9)' },
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
                  name: DatasetName.RegressionPolynomial,
                  label: 'Regression (polynomial)',
                  data: newData,
                  fill: false,
                  showLine: showRegressionsLine,
                  borderColor: 'rgba(246, 0, 255, 0.1)',
                  backgroundColor: 'rgba(246, 0, 255, 0.3)',

                  regressions: {
                      type: ['polynomial'],
                      line: { color: 'blue', width: 3 },
                      extendPredictions: true,
                      sections: [
                          {
                              endIndex: dataLength - 1,
                              line: { color: 'rgba(246, 0, 255, 0.9)' },
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
                hidden: true,
                type: ErrorBarsController.id,
                name: DatasetName.Roman,
                label: '# Data (by Romanovskiy)',
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
                hidden: true,
                name: DatasetName.RomanPlus,
                label: '# Data (by Romanovskiy +)',
                data: roman.map((e) => e.y + e.beta),
                fill: false,
                backgroundColor: 'rgb(255, 99, 140, 0.5)',
                borderColor: 'rgba(255, 99, 140, 0.2)',
                tension: 0.5,
            },
            {
                hidden: true,
                name: DatasetName.RomanMinus,
                label: '# Data (by Romanovskiy -)',
                data: roman.map((e) => e.y - e.beta),
                fill: 1,
                backgroundColor: 'rgb(20, 90, 110, 0.5)',
                borderColor: 'rgba(20, 90, 110, 0.2)',
                tension: 0.5,
            },

            // Sigma
            {
                // hidden: true,
                name: DatasetName.Sigma,
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
                // hidden: true,
                name: DatasetName.SigmaPlus,
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
                hidden: true,
                name: DatasetName.Smooth,
                label: `Smooth data (lvl=${smoothLevel})`,
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

    return (
        <ChartComponent
            ref={props.chart}
            id="smart-chart"
            plugins={[ChartRegressions]}
            data={dataRomanAndSigma}
            options={options}
        />
    );
};

export default React.memo(Variant7);
