import React from 'react';
import { Container, Row, Col } from 'shards-react';

import PageTitle from '../components/common/PageTitle.component';
import ChartCard from '../components/cards/Chart-card.component';
import TableCard from '../components/cards/Table-card.component';
import SlidersCard from '../components/cards/Sliders-card.component';

import { useDebounce } from '../utils/debounceHook-react.util';
import { csv_data } from '../utils/inputData.util';

const MainPage = () => {
    const [data,setCsvData] = React.useState(() => csv_data);
    const [prediction, setPrediction] = useDebounce(3, 500);

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="Chart viewer" subtitle="Main page" className="text-sm-left mb-3" />
            </Row>
            <Row>
                <Col lg="9" md="9" sm="9" className="mb-4">
                    <ChartCard csv_data={data} prediction={prediction} />
                    <SlidersCard changePrediction={setPrediction} />
                </Col>
                <Col lg="3" className="mb-4">
                    <TableCard csv_data={data} setCsvData={setCsvData} />
                </Col>
            </Row>
        </Container>
    );
};
export default MainPage;
