import React from 'react';
import { useDispatch } from 'react-redux';
import { ChartRegressions } from 'chartjs-plugin-regression';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, FormCheckbox, ButtonGroup } from 'shards-react';

import Variant7, { DatasetName } from '../variants/Variant7';
import * as chartActions from '../../store/reducer/chart/actions';

const ChartCard = () => {
    const chartData = React.useRef({ chart: null, data: null });
    const dispatch = useDispatch();

    const [isLockRegressionsTypes, setLockRegressionsTypes] = React.useState(false);
    const [isDisplayAllRegressionsTypes, setDisplayAllRegressionsTypes] = React.useState(false);
    const [regressionsTypes, setRegressionsTypes] = React.useState({
        linear: true,
        exponential: true,
        polynomial: true,
    });
    const regressionsTypesArr = React.useMemo(
        () =>
            Object.entries(regressionsTypes)
                .filter(([, e]) => e)
                .map(([e]) => e),
        [regressionsTypes]
    );
    const [regressionsResults, setRegressionsResults] = React.useState<any>({});

    const onRegressionResults = React.useCallback(() => {
        if (!chartData.current.chart) return;

        const maxDatasets = 10;
        let results = {};
        for (let i = 0; i < maxDatasets; ++i) {
            const sections = ChartRegressions.getSections(chartData.current.chart, i);
            sections?.forEach((section) => {
                const name = (
                    ((section as any)._meta.dataset.name as DatasetName)?.toString().split('regression')[1] as string
                ).toLowerCase();
                if (section.result.r2 && name && regressionsTypes[name]) {
                    results[name] = {
                        type: section.result.type,
                        string: section.result.string,
                        color: section.line.color,
                        equation: [...section.result.equation],
                        r2: Math.round(section.result.r2 * 1e3) / 10 + '%',
                    };
                }
            });
        }

        // dispatch(chartActions.setRegressionData(results));
        setRegressionsResults(results);
    }, [regressionsTypes]);

    const handleChangeRegressionsTypes = React.useCallback((e, name) => {
        setRegressionsTypes((state) => ({
            ...state,
            [name]: Object.values(state).filter(Boolean).length === 1 || !state[name],
        }));
    }, []);

    React.useEffect(() => {
        setLockRegressionsTypes(Object.values(regressionsTypes).filter(Boolean).length === 1);
    }, [regressionsTypes, setLockRegressionsTypes]);

    React.useEffect(() => {
        (window as any).chartData = () => chartData.current;
    }, [chartData.current]);

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
            <CardBody className="pt-0">
                <Row className="border-bottom py-2 bg-light">
                    {/* <Col sm="6" className="d-flex mb-2 mb-sm-0">
                        <RangeDatePicker />
                    </Col> */}
                    {/* <Col>
                        <Button size="sm" className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0">
                            View Full Report &rarr;
                        </Button>
                    </Col> */}
                    <Col className="d-flex mb-0 mb-sm-0">
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
                        <ButtonGroup className="ml-3">
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
                    onRegressionResults={onRegressionResults}
                    isDisplayAllRegressionsTypes={isDisplayAllRegressionsTypes}
                    chart={chartData}
                />
            </CardBody>
            <CardFooter className="border-top">
                <Row>
                    <Col>
                        <table className="table mb-0">
                            <tbody className="bg-light">
                                {isDisplayAllRegressionsTypes && // выводить, только когда включены все (фича)
                                    Object.entries(regressionsResults).map(([name, result]: any) => (
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
