import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardFooter, Row, Col, Collapse, Button } from 'shards-react';
import TableEditor from '../editor/Table.editor';
import { useSelector } from 'react-redux';

const TableCsvDataCard = ({ title }) => {
    const chartData = useSelector((state) => state.chart.chartData);
    const [isOpen, setOpen] = React.useState(true);

    return (
        <Card small>
            <CardHeader className="border-bottom">
                <Button outline size="sm" onClick={() => setOpen((s) => !s)}>
                    <h6 className="m-0">
                        {title} [{chartData.length}] {isOpen ? '↑' : '↓'}
                    </h6>
                </Button>
            </CardHeader>

            <Collapse open={isOpen}>
                <CardBody className="p-0">
                    <TableEditor />
                </CardBody>
            </Collapse>

            <CardFooter className="border-top">
                <Row>
                    <Col className="text-right view-report">
                        <Button outline size="sm" onClick={() => setOpen((s) => !s)}>
                            {isOpen ? 'Close' : 'Open'}
                        </Button>
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    );
};

TableCsvDataCard.propTypes = {
    /**
     * The component's title.
     */
    title: PropTypes.string,
};

TableCsvDataCard.defaultProps = {
    title: 'Table data',
};

export default TableCsvDataCard;
