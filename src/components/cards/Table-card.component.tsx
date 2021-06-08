import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardFooter, Row, Col } from 'shards-react';
import TableEditor from '../editor/Table.editor';

const TableCard = ({ title, csv_data, setCsvData }) => (
    <Card small>
        <CardHeader className="border-bottom">
            <h6 className="m-0">{title}</h6>
            <div className="block-handle" />
        </CardHeader>

        <CardBody className="p-0">
            <TableEditor data={csv_data} setData={setCsvData} />
        </CardBody>

        {/* <CardFooter className="border-top">
            <Row>
                <Col className="text-right view-report">
                    <a href="#">View full &rarr;</a>
                </Col>
            </Row>
        </CardFooter> */}
    </Card>
);

TableCard.propTypes = {
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

TableCard.defaultProps = {
    title: 'Table data',
    csv_data: [],
};

export default TableCard;
