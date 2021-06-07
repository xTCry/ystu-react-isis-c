import { Row, Col, Card, CardHeader, CardBody, ListGroup, ListGroupItem, Slider } from 'shards-react';
import { Variant7 } from '../variants/Variant7';

const ChartCard = ({ csv_data, prediction }) => {
    return (
        // <Card small className="h-100">
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <h6 className="m-0">Hq</h6>
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
                </Row>
                <Variant7 data={csv_data} prediction={prediction} />
                {/* <canvas height="120" ref={this.canvasRef} style={{ maxWidth: '100% !important' }} /> */}
            </CardBody>
        </Card>
    );
};
export default ChartCard;
