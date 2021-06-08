import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem } from 'shards-react';

const ChartInfoCard = ({ title }) => {
    return (
        <Card small className="mb-3">
            <CardHeader className="border-bottom">
                <h6 className="m-0">{title}</h6>
            </CardHeader>

            <CardBody className="p-0">
                <ListGroup flush>
                    <ListGroupItem className="p-3">
                        <span className="d-flex mb-2">
                            <i className="material-icons mr-1">calendar_today</i>
                            <strong className="mr-1">Updated:</strong> Now
                        </span>
                        <span className="d-flex">
                            <i className="material-icons mr-1">score</i>
                            <strong className="mr-1">Readability:</strong> <strong className="text-warning">Ok</strong>
                        </span>
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
