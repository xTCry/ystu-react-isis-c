import React from 'react';
import { Container, Row, Col } from 'shards-react';

import PageTitle from '../components/common/PageTitle.component';
import ChartCard from '../components/cards/Chart-card.component';
import SlidersCard from '../components/cards/Sliders-card.component';
import ChartInfoCard from '../components/cards/ChartInfo-card.component';
import PivotTableCard from '../components/cards/PivotTable-card.component';
import FileManagerCard from '../components/cards/FileManager-card.component';
import TableCsvDataCard from '../components/cards/TableCsvData-card.component';

import { useDebounce } from '../utils/debounceHook-react.util';
import { csv_data } from '../utils/inputData.util';

const MainPage = () => {
    const [data,setCsvData] = React.useState(() => csv_data);
    const [prediction, setPrediction] = useDebounce(5, 300);
    const [smoothLevel, setSmoothLevel] = useDebounce(3, 300);

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="Chart viewer" subtitle="Main page" className="text-sm-left mb-3" />
            </Row>
            <Row>
                <Col lg="9" md="9" sm="12" className="mb-4">
                    <ChartCard csv_data={data} prediction={prediction} smoothLevel={smoothLevel} />
                    <SlidersCard changePrediction={setPrediction} changeSmoothLevel={setSmoothLevel} />
                    <PivotTableCard data={data} />
                </Col>
                <Col lg="3" className="mb-4">
                    <FileManagerCard />
                    <ChartInfoCard />
                    <TableCsvDataCard csv_data={data} setCsvData={setCsvData} />
                </Col>
            </Row>
        </Container>
    );
};
export default MainPage;
