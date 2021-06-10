import React from 'react';
import { Container, Row, Col } from 'shards-react';
import Tour from 'reactour';

import packageJson from '../../package.json';

import PageTitle from '../components/common/PageTitle.component';
import ChartCard from '../components/cards/Chart-card.component';
import SlidersCard from '../components/cards/Sliders-card.component';
import ChartInfoCard from '../components/cards/ChartInfo-card.component';
import PivotTableCard from '../components/cards/PivotTable-card.component';
import FileManagerCard from '../components/cards/FileManager-card.component';
import TableCsvDataCard from '../components/cards/TableCsvData-card.component';

import { dispatch } from '../store/configureStore';
import * as chartActions from '../store/reducer/chart/actions';
import { isFirstRun, saveFirstRun } from '../store/reducer/chart/reducers';
import { useSelector } from 'react-redux';

const MainPage = () => {
    const [isTourOpen, setIsTourOpen] = React.useState(false);
    const { chartData } = useSelector((state) => state.chart);
    const steps = [
        {
            content: `Добро пожалость в ${packageJson.name}!.. (нажимайте клавишу → для продолжения)`,
            // style: {
            //     backgroundColor: 'black',
            //     color: 'white',
            // },
        },
        {
            selector: '#react-csv-reader-input',
            content: 'Вы можете открыть ваш CSV файл',
        },
        {
            selector: '[data-tut="reactour__table-csv-data-card"]',
            content: 'Или же начать вводить свои данные прямо здесь!',
        },
        {
            selector: '[data-tut="reactour__table-csv-data-card"] #add > span.MuiButton-label',
            content: 'Просто нажмите на NEW и изменяйте данные ниже',
            action: () => {
                chartData.length < 1 &&
                    dispatch(
                        chartActions.setChartData([
                            { x: 1, y: (Math.random() * 10) | 0 },
                            { x: 2, y: (Math.random() * 30) | 0 },
                            { x: 3, y: (Math.random() * 10) | 0 },
                            { x: 3, y: ((Math.random() * 90) | 0) + 50 },
                            { x: 4, y: (Math.random() * 10) | 0 },
                            { x: 5, y: (Math.random() * 30) | 0 },
                            { x: 6, y: (Math.random() * 20) | 0 },
                        ])
                    );
            },
        },
        {
            selector: '[data-tut="reactour__table-csv-data-card"]',
            content:
                'Если ячейка КРАСНАЯ - значит нужно ввести корректное число, а если СИНЯЯ - значит значение является "ошибочным" и его нужно скорректировать.',
        },
        {
            selector: '[data-tut="reactour__chart-info--undore"]',
            content: 'Для удобства отмены и повтора есть следующие кнопки. (История хранится до 20 изменений)',
        },
        {
            selector: '[data-tut="reactour__filemanager--status"]',
            content: 'Информация о востановлении или сохранении данных отображается здесь',
        },
        {
            selector: '[data-tut="reactour__filemanager--save-csv"]',
            content:
                'Для сохранения новых данных в CSV файл используйте эту кнопку. Спрогнозированные данные тоже сохраняются',
        },
        {
            selector: '[data-tut="reactour__filemanager--save-pdf"]',
            content:
                'Чтобы экспортировать данные в PDF используйте эту кнопку. Сохраняется скриншот графика и таблицы с данными',
        },
        {
            selector: '[data-tut="reactour__filemanager--close"]',
            content: 'Для закрытия (очистки) всех данных используйте кнопку Close',
        },
        {
            selector: '[data-tut="reactour__chart-info--errors-buttons"]',
            content: 'Чтобы очистить данные от погрешностей, используйте эти две кнопки',
        },
        {
            selector: '[data-tut="reactour__chart-info--regression-type"]',
            content:
                'Вы можете выбрать тип регресси используемый по умолчанию (отображение в таблице и сохранение в csv)',
        },
        {
            selector: '[data-tut="reactour__chart-card"]',
            content:
                'Здесь отображается непосредственно сам график с ЗУМИРОВАНИЕМ и разными датасетами, а сверху и снизу есть дополнительные фичи...',
        },
        {
            selector: '[data-tut="reactour__chart-card--regression-type-toggles"]',
            content: 'Это переключалки режимов датасетов регрессий. По умолчанию выберается один из подхоящих.',
        },
        {
            selector: '[data-tut="reactour__chart-card--regression-type-toggle-all"]',
            content: 'Для отображения всех датасетов используется этот переключатель.',
        },
        {
            selector: '[data-tut="reactour__chart-card--formulas"]',
            content: 'Информация о расчетах разными методами с отрисовкой на графике.',
        },
        {
            selector: '[data-tut="reactour__sliders-card"]',
            content: 'Опции для настройки визуализации и прогназирования... Должно быть понятно.',
        },
        {
            selector: '[data-tut="reactour__pivot-table-card"]',
            content: 'Здесь выводится информация о сводных расчетах. Нужно еще правильно ввести данные...',
        },
        // {
        //     selector: '[data-tut="reactour__"]',
        //     content: '',
        // },
        {
            content: 'Готовы к работе!',
            action: () => {
                saveFirstRun();
                // chartData.length > 0 && dispatch(chartActions.close());
            },
        },
    ];

    React.useEffect(() => {
        if (isFirstRun()) {
            setIsTourOpen(true);
        }
    }, []);

    (window as any).tourGo = () => setIsTourOpen(true);

    return (
        <Container fluid className="main-content-container px-4">
            <Tour steps={steps} isOpen={isTourOpen} onRequestClose={() => setIsTourOpen(false)} />
            <Row noGutters className="page-header py-4">
                <PageTitle title="Chart viewer" subtitle="Main page" className="text-sm-left mb-3" />
            </Row>
            <Row>
                <Col lg="9" md="9" sm="12" className="mb-4">
                    <ChartCard />
                    <SlidersCard />
                    <PivotTableCard />
                </Col>
                <Col lg="3" className="mb-4">
                    <FileManagerCard />
                    <ChartInfoCard />
                    <TableCsvDataCard />
                </Col>
            </Row>
        </Container>
    );
};
export default MainPage;
