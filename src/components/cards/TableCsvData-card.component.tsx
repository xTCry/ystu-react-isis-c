import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardFooter, Row, Col, Collapse, Button, ListGroupItem } from 'shards-react';
import TableEditor from '../editor/Table.editor';

const TableCsvDataCard = ({ title, csv_data, setCsvData }) => {
    const [isOpen, setOpen] = React.useState(true);
    return (
        <Card small>
            <CardHeader className="border-bottom">
                <Button outline size="sm" onClick={() => setOpen((s) => !s)}>
                    <h6 className="m-0">{title}</h6>
                </Button>
            </CardHeader>

            <Collapse open={isOpen}>
                <CardBody className="p-0">
                    <TableEditor data={csv_data} setData={setCsvData} />
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
    /**
     * The referral csv data.
     */
    csv_data: PropTypes.array,
    /**
     * set csv data callback.
     */
    setCsvData: PropTypes.func,
};

TableCsvDataCard.defaultProps = {
    title: 'Table data',
    csv_data: [],
};

export default TableCsvDataCard;
