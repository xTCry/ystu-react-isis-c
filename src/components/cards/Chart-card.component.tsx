import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, FormCheckbox, ButtonGroup } from 'shards-react';
import { Variant7 } from '../variants/Variant7';

const ChartCard = ({ csv_data, ...props }) => {
    const [isLockRegressionsTypes, setLockRegressionsTypes] = React.useState(false);
    const [isDisplayAllRegressionsTypes, setDisplayAllRegressionsTypes] = React.useState(false);
    const [regressionsTypes, setRegressionsTypes] = React.useState({
        linear: true,
        exponential: true,
        polynomial: true,
    });

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
                                    disabled={(regressionsTypes[radio.value] && isLockRegressionsTypes) || isDisplayAllRegressionsTypes}
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
                    {...(props as any)}
                />
            </CardBody>
        </Card>
    );
};
export default ChartCard;
  