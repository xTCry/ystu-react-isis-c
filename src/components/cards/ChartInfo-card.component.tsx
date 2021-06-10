import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    CardHeader,
    CardBody,
    ListGroup,
    ListGroupItem,
    Button,
    FormSelect,
    Row,
    Col,
    Collapse,
    CardFooter,
} from 'shards-react';

import { useChartDataErrors } from '../variants/Variant7';
import * as chartActions from '../../store/reducer/chart/actions';
import { RegressionType } from '../../utils/formulas.util';

const ChartInfoCard = ({ title }) => {
    const dispatch = useDispatch();
    const [isOpen, setOpen] = React.useState(true);
    const { prevChartData, nextChartData, regressionType, regressionData, chartData } = useSelector((state) => state.chart);
    const [bestType, setBestType] = React.useState<RegressionType>(null);

    const { sigmaMult, std, roman, sigma } = useChartDataErrors();
    const [filterSigmaCount, setFilterSigmaCount] = React.useState(0);
    const [filterRomanCount, setFilterRomanCount] = React.useState(0);

    const onFilterSigma = React.useCallback(() => {
        const newData = chartData.filter((e, i) => sigma[i].isOk && sigma[i].y === e.y);
        dispatch(chartActions.setChartData(newData));
    }, [chartData, sigma]);

    const onFilterRoman = React.useCallback(() => {
        const newData = chartData.filter((e, i) => roman[i].isOk && roman[i].y === e.y);
        dispatch(chartActions.setChartData(newData));
    }, [chartData, roman]);

    const onBackChartData = React.useCallback(() => {
        dispatch(chartActions.prevChartData());
    }, []);

    const onNextChartData = React.useCallback(() => {
        dispatch(chartActions.nextChartData());
    }, []);

    const onRegressionType = React.useCallback((e) => {
        dispatch(chartActions.setRegressionType(e.target.value));
    }, []);

    React.useEffect(() => {
        const bt = Object.values(RegressionType).reduce((max: any, type) => {
            const r = regressionData[type];
            return !max || max.r2 < r.r2 ? r : max;
        }, null);

        setBestType(bt?.type);
    }, [regressionData, setBestType]);

    React.useEffect(() => {
        let c = 0;
        for (let s of sigma) {
            if (!s.isOk) ++c;
        }
        setFilterSigmaCount(c);
    }, [sigma, setFilterSigmaCount]);

    React.useEffect(() => {
        let c = 0;
        for (let s of roman) {
            if (!s.isOk) ++c;
        }
        setFilterRomanCount(c);
    }, [roman, setFilterRomanCount]);

    return (
        <Card small className="mb-3">
            <CardHeader className="border-bottom">
                <Button outline size="sm" onClick={() => setOpen((s) => !s)}>
                    <h6 className="m-0">
                        {title} {isOpen ? '↑' : '↓'}
                    </h6>
                </Button>
            </CardHeader>
            <Collapse open={isOpen}>
                {chartData.length > 0 && (
                    <CardBody className="p-0">
                        <ListGroup flush>
                            {/* <ListGroupItem className="p-3">
                            <span className="d-flex mb-2">
                                <i className="material-icons mr-1">calendar_today</i>
                                <strong className="mr-1">Saved:</strong>
                                {saved === 0 ? 'Not' : ` at ${new Date(saved)}`}
                            </span>
                        </ListGroupItem> */}

                            <ListGroupItem className="px-3 py-0">
                                <strong className="d-block my-2">Filter bad dots</strong>

                                <Row className="mb-3 mt-2">
                                    <Col>
                                        <Button
                                            outline
                                            theme="warning"
                                            size="sm"
                                            onClick={onFilterSigma}
                                            disabled={filterSigmaCount === 0}
                                        >
                                            <i className="material-icons">file_copy</i> Filter data by Sigma [
                                            {filterSigmaCount}]
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            outline
                                            theme="warning"
                                            size="sm"
                                            onClick={onFilterRoman}
                                            disabled={filterRomanCount === 0}
                                        >
                                            <i className="material-icons">file_copy</i> Filter data by Roman [
                                            {filterRomanCount}]
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroupItem>

                            <ListGroupItem className="px-3 py-0">
                                Sigma:
                                <code>
                                    sigmaMult * std = {sigmaMult} * {std} = {sigmaMult * std}
                                </code>
                            </ListGroupItem>

                            <ListGroupItem className="px-3">
                                <strong className="d-block mb-2">
                                    Default regression type (best: {bestType} [
                                    {bestType && Math.round(regressionData[bestType]?.r2 * 100)}
                                    %])
                                </strong>
                                <FormSelect onChange={onRegressionType} value={regressionType}>
                                    {Object.keys(RegressionType).map((e) => (
                                        <option value={RegressionType[e]}>
                                            {e} [{Math.round(regressionData[RegressionType[e]]?.r2 * 100)}%]
                                        </option>
                                    ))}
                                </FormSelect>
                            </ListGroupItem>
                        </ListGroup>
                    </CardBody>
                )}

                <CardFooter className="border-top d-flex">
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
                </CardFooter>
            </Collapse>
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
