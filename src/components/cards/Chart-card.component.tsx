import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, FormCheckbox, ButtonGroup } from 'shards-react';
import { ChartRegressions } from 'chartjs-plugin-regression';
import { Variant7 } from '../variants/Variant7';

const ChartCard = ({ csv_data, ...props }) => {
    const chart = React.useRef(null);
    const [isLockRegressionsTypes, setLockRegressionsTypes] = React.useState(false);
    const [isDisplayAllRegressionsTypes, setDisplayAllRegressionsTypes] = React.useState(false);
    const [regressionsTypes, setRegressionsTypes] = React.useState({
        linear: true,
        exponential: true,
        polynomial: true,
    });
    const [regressionsResults, setRegressionsResults] = React.useState([]);

    const timeIntervalRef = React.useRef(null);
    const onRegressionResults = React.useCallback(() => {
        if (!chart.current) return;
        const maxDatasets = 10;
        let results = [];
        for (let i = 0; i < maxDatasets; ++i) {
            const sections = ChartRegressions.getSections(chart.current, i);
            sections?.forEach((section) => {
                if (section.result.r2) {
                    let result = {
                        type: (section.result as any).type,
                        string: section.result.string,
                        color: section.line.color,
                        equation: [...section.result.equation],
                        r2: Math.round(section.result.r2 * 1000) / 10 + '%',
                    };
                    results.push(result);
                }
            });
        }
        setRegressionsResults(results);
    }, []);

    React.useEffect(()=>{
        timeIntervalRef.current && clearTimeout(timeIntervalRef.current);
        timeIntervalRef.current = setInterval(onRegressionResults, 1e3);

        return () => {
            timeIntervalRef.current && clearInterval(timeIntervalRef.current);
        };
    },[])

    const handleChangeRegressionsTypes = React.useCallback((e, name) => {
        setRegressionsTypes((state) => ({
            ...state,
            [name]: Object.values(state).filter(Boolean).length === 1 || !state[name],
        }));
    }, []);

    React.useEffect(() => {
        setLockRegressionsTypes(Object.values(regressionsTypes).filter(Boolean).length === 1);
    }, [regressionsTypes, setLockRegressionsTypes]);

    const radios = [
        { name: 'Linear', value: 'linear' },
        { name: 'Exponential', value: 'exponential' },
        { name: 'Polynomial', value: 'polynomial' },
    ];

    return (
        // <Card small className="h-100">
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
                    data={csv_data}
                    regressionsTypes={Object.entries(regressionsTypes)
                        .filter(([, e]) => e)
                        .map(([e]) => e)}
                    isDisplayAllRegressionsTypes={isDisplayAllRegressionsTypes}
                    chart={chart}
                    {...(props as any)}
                />
            </CardBody>
            <CardFooter className="border-top">
                <Row>
                    <Col>
                        <table className="table mb-0">
                            <tbody className="bg-light">
                                {regressionsResults.map((result, i) => (
                                    <tr key={i} style={{ color: result.color }}>
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
  