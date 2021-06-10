import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChartRegressions } from 'chartjs-plugin-regression';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, FormCheckbox, ButtonGroup } from 'shards-react';
import * as regression from 'regression';

import Variant7, { DatasetName } from '../variants/Variant7';
import * as chartActions from '../../store/reducer/chart/actions';
import { calcualteRegression, RegressionType } from '../../utils/formulas.util';

const ChartCard = () => {
    const { chartData, prediction } = useSelector((state) => state.chart);
    const chartAndData = React.useRef({ chart: null, data: null });
    const dispatch = useDispatch();

    const [isLockRegressionsTypes, setLockRegressionsTypes] = React.useState(false);
    const [isDisplayAllRegressionsTypes, setDisplayAllRegressionsTypes] = React.useState(false);
    const [regressionsTypes, setRegressionsTypes] = React.useState<{ [K in RegressionType]?: boolean }>({
        linear: true,
        exponential: true,
        polynomial: true,
    });
    const regressionsTypesArr = React.useMemo(
        () =>
            Object.entries(regressionsTypes)
                .filter(([, e]) => e)
                .map(([e]) => e as RegressionType),
        [regressionsTypes]
    );
    const [regressionsResults, setRegressionsResults] = React.useState<any>({});

    const onRegressionResults = React.useCallback(() => {
        if (!chartAndData.current.chart) return;

        let results = {};
        if (chartData.length > 1) {
            const dataPredictionLength = chartData.length + prediction;
            // const startLabel = chartData[0].x;
            const endLabel = chartData[chartData.length - 1].x;
            const dataPoints: regression.DataPoint[] = new Array(dataPredictionLength)
                .fill(0)
                .map((v, i) => (i >= chartData.length ? [i, null] : [i, chartData[i].y]));

            for (const type of Object.values(RegressionType)) {
                let result: any = {
                    ...calcualteRegression(type, dataPoints),
                    // color: ,
                    type,
                    dataPoints,
                    points2: new Array(dataPredictionLength).fill(null),
                };
                result.points.forEach(([x, y], i) => {
                    // result.points2[i] = { x: i + startLabel, y: i >= chartData.length ? y : chartData[i].y };
                    result.points2[i] = {
                        x: i < chartData.length ? chartData[i].x : i + endLabel - chartData.length + 1,
                        y: i < chartData.length ? chartData[i].y : y,
                    };
                });
                results[type] = result;
            }
        }

        console.log('setRegressionData', results);
        dispatch(chartActions.setRegressionData(results));
        setRegressionsResults(results);
    }, [regressionsTypes, chartData, prediction]);

    const handleChangeRegressionsTypes = React.useCallback((e, name) => {
        setRegressionsTypes((state) => ({
            ...state,
            [name]: Object.values(state).filter(Boolean).length === 1 || !state[name],
        }));
    }, []);

    React.useEffect(() => {
        onRegressionResults();
    }, [chartData, prediction, regressionsTypes, isDisplayAllRegressionsTypes]);

    React.useEffect(() => {
        setLockRegressionsTypes(Object.values(regressionsTypes).filter(Boolean).length === 1);
    }, [regressionsTypes, setLockRegressionsTypes]);

    React.useEffect(() => {
        (window as any).chartData = () => chartAndData.current;
    }, [chartAndData.current]);

    const radios = [
        { name: 'Linear', value: 'linear' },
        { name: 'Exponential', value: 'exponential' },
        { name: 'Polynomial', value: 'polynomial' },
    ];

    return (
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <h6 className="m-0">Smart Chart</h6>
            </CardHeader>
            <CardBody className="pt-0" data-tut="reactour__chart-card">
                <Row className="border-bottom py-2 bg-light">
                    {/* <Col sm="6" className="d-flex mb-2 mb-sm-0">
                        <RangeDatePicker />
                    </Col> */}
                    {/* <Col>
                        <Button size="sm" className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0">
                            View Full Report &rarr;
                        </Button>
                    </Col> */}
                    <Col className="d-flex mb-0 mb-sm-0" data-tut="reactour__chart-card--regression-type-toggles">
                        Regressions type:
                        <ButtonGroup className="ml-3">
                            {radios.map((radio, idx) => (
                                <FormCheckbox
                                    inline
                                    toggle
                                    key={idx}
                                    disabled={
                                        (regressionsTypes[radio.value] && isLockRegressionsTypes) ||
                                        isDisplayAllRegressionsTypes
                                    }
                                    checked={regressionsTypes[radio.value]}
                                    onChange={(e) => handleChangeRegressionsTypes(e, radio.value)}
                                >
                                    {radio.name}
                                </FormCheckbox>
                            ))}
                        </ButtonGroup>
                    </Col>
                    <Col>
                        <ButtonGroup className="ml-3" data-tut="reactour__chart-card--regression-type-toggle-all">
                            <FormCheckbox
                                inline
                                toggle
                                checked={isDisplayAllRegressionsTypes}
                                onChange={(e) => setDisplayAllRegressionsTypes((s) => !s)}
                            >
                                Dislay all regressions types
                            </FormCheckbox>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Variant7
                    regressionsTypes={regressionsTypesArr}
                    isDisplayAllRegressionsTypes={isDisplayAllRegressionsTypes}
                    chart={chartAndData}
                />
            </CardBody>
            <CardFooter className="border-top">
                <Row>
                    <Col data-tut="reactour__chart-card--formulas">
                        <table className="table mb-0">
                            <tbody className="bg-light">
                                {Object.entries(regressionsResults).map(([name, result]: any) => (
                                    <tr key={name} style={{ color: result.color }}>
                                        <td>{result.type}</td>
                                        <td>R² = {result.r2}</td>
                                        <td>{result.string}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    );
};
export default React.memo(ChartCard);
