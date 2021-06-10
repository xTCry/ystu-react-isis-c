import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Button, Col, FormSelect } from 'shards-react';
import * as chartActions from '../../store/reducer/chart/actions';
import { RegressionType } from '../../utils/formulas.util';

const ChartInfoCard = ({ title }) => {
    const dispatch = useDispatch();
    const { prevChartData, nextChartData, regressionType } = useSelector((state) => state.chart);

    let filterCount = 2;

    const onFilter = React.useCallback(() => {
        //
    }, []);

    const onBackChartData = React.useCallback(() => {
        dispatch(chartActions.prevChartData());
    }, []);

    const onNextChartData = React.useCallback(() => {
        dispatch(chartActions.nextChartData());
    }, []);

    const onRegressionType = React.useCallback((e) => {
        dispatch(chartActions.setRegressionType(e.target.value));
    }, []);

    return (
        <Card small className="mb-3">
            <CardHeader className="border-bottom">
                <h6 className="m-0">{title}</h6>
            </CardHeader>

            <CardBody className="p-0">
                <ListGroup flush>
                    {/* <ListGroupItem className="p-3">
                        <span className="d-flex mb-2">
                            <i className="material-icons mr-1">calendar_today</i>
                            <strong className="mr-1">Saved:</strong>
                            {saved === 0 ? 'Not' : ` at ${new Date(saved)}`}
                        </span>
                    </ListGroupItem> */}

                    <ListGroupItem className="d-flex px-3">
                        <Button outline theme="warning" onClick={onFilter} disabled={filterCount === 0}>
                            <i className="material-icons">file_copy</i> Filter data [{filterCount}]
                        </Button>
                    </ListGroupItem>

                    <ListGroupItem className="px-3">
                        <strong className="d-block mb-2">Default regression type</strong>
                        <FormSelect onChange={onRegressionType} value={regressionType}>
                            {Object.keys(RegressionType).map((e) => (
                                <option value={RegressionType[e]}>{e}</option>
                            ))}
                        </FormSelect>
                    </ListGroupItem>

                    <hr className="my-0" />
                    <ListGroupItem className="d-flex">
                        <Button theme="light" disabled={prevChartData.length === 0} onClick={onBackChartData}>
                            <i className="material-icons">file_copy</i> Undo [{prevChartData.length}]
                        </Button>

                        <Button
                            theme="light"
                            className="ml-auto"
                            disabled={nextChartData.length === 0}
                            onClick={onNextChartData}
                        >
                            <i className="material-icons">file_copy</i> Redo [{nextChartData.length}]
                        </Button>
                    </ListGroupItem>
                </ListGroup>
            </CardBody>
        </Card>
    );
};

ChartInfoCard.propTypes = {
    /**
     * The component's title.
     */
    title: PropTypes.string,
};

ChartInfoCard.defaultProps = {
    title: 'Chart Info',
};

export default ChartInfoCard;
