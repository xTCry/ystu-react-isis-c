import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import CSVReader from 'react-csv-reader';
import { CSVLink } from 'react-csv';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Button, Collapse } from 'shards-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

import * as chartActions from '../../store/reducer/chart/actions';
import { RegressionType } from '../../utils/formulas.util';

const FileManagerCard = ({ title }) => {
    const dispatch = useDispatch();
    const [isOpen, setOpen] = React.useState(true);
    const { chartData, regressionData, regressionType, fileName, restored, saved, prediction } = useSelector((state) => state.chart);

    const onSave2pdf = React.useCallback(() => {
        if (Object.keys(RegressionType).length < 1) return;
        const canvas = document.getElementById('smart-chart') as HTMLCanvasElement;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            unit: 'pt',
            format: [canvas.width, canvas.height],
        });

        pdf.text(`Input data: ${chartData.length}`, 40, 55);
        pdf.text(`Prediction: ${prediction}`, 40, 75);
        pdf.setDrawColor(100, 100, 100);
        pdf.line(100, 110, 500, 110);
        
        pdf.addPage([canvas.width, canvas.height], 'landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

        for (const e of Object.keys(RegressionType)) {
            pdf.addPage('a4', 'portrait');
            pdf.text(`Regression type: ${e}${RegressionType[e] === regressionType ? ' (Selected)' : ''}`, 40, 55);
            ((pdf as any).autoTable as autoTable)({
                margin: { top: 80 },
                head: [['Id', 'Year', 'Value']],
                body: [
                    ...regressionData[RegressionType[e]]?.points2.map((e, i) => [
                        { content: i + 1 },
                        { content: e.x, styles: { textColor: i > chartData.length ? 101 : 20 } },
                        { content: e.y, styles: { textColor: i > chartData.length ? 101 : 20 } },
                    ]),
                ],
            });
        }

        pdf.addPage('a4', 'portrait');
        pdf.text('Pivot table', 40, 55);
        ((pdf as any).autoTable as autoTable)({
            margin: { top: 80 },
            html: '#pivot-table',
        });

        let pdfName = 'download';
        if (fileName?.length > 0) {
            let q = fileName.split('.');
            q.length > 1 && q.pop();
            pdfName = q.join('.');
        }
        pdf.save(`${pdfName}.pdf`);
    }, [chartData, regressionData, regressionType, fileName]);

    const onCloseCsv = React.useCallback(() => {
        (document.getElementById('react-csv-reader-input') as HTMLInputElement).value = null;
        dispatch(chartActions.close());
    }, []);

    const onCsvLink = React.useCallback((e) => {
        dispatch(chartActions.setSaved(true));
    }, []);

    const onLoaded = React.useCallback((_data, fileInfo) => {
        let data = _data
            .map(([_x, _y]) => {
                const y = Number(String(_y).replace(',', '.'));
                return { x: Number(_x), y };
            })
            .filter(({ y }) => !isNaN(y));
        console.log('loaded & parsed data', data);

        dispatch(chartActions.setChartData(data));
        dispatch(chartActions.setFileName(fileInfo.name));
        dispatch(chartActions.loadCsvData(data));
    }, []);

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
                <CardBody className="p-0">
                    <ListGroup flush>
                        <ListGroupItem className="p-3" data-tut="reactour__filemanager--status">
                            <span className="d-flex mb-2">
                                <i className="material-icons mr-1">flag</i>
                                <strong className="mr-1">Saved:</strong>
                                <strong className="text-warning">
                                    {saved === 0 ? 'Not' : ` at ${new Date(saved)}`}
                                </strong>
                            </span>
                            <span className="d-flex">
                                <i className="material-icons mr-1">score</i>
                                <strong className="mr-1">Restored:</strong>
                                {restored === 0 ? 'Not' : `Restored at ${new Date(restored)}`}
                            </span>
                            {/* <span className="d-flex mb-2">
                            <i className="material-icons mr-1">visibility</i>
                            <strong className="mr-1">Visibility:</strong>
                            <strong className="text-success">Public</strong>
                        </span> */}
                            {/* <span className="d-flex mb-2">
                            <i className="material-icons mr-1">calendar_today</i>
                            <strong className="mr-1">Saved:</strong>
                            Now
                        </span> */}
                            {/* <span className="d-flex">
                            <i className="material-icons mr-1">score</i>
                            <strong className="mr-1">Changed:</strong>
                            <strong className="text-success">True</strong>
                        </span> */}
                        </ListGroupItem>

                        <hr className="my-2" />

                        <ListGroupItem className="px-3 py-0">
                            <strong className="text-muted d-block mb-2">Load csv file</strong>
                            <div className="custom-file mb-3">
                                <CSVReader
                                    cssInputClass="custom-file-input"
                                    onFileLoaded={onLoaded}
                                    inputId="react-csv-reader-input"
                                />
                                <label className="custom-file-label" htmlFor="react-csv-reader-input">
                                    {fileName ? `Loaded ${fileName}` : 'Choose csv file...'}
                                </label>
                            </div>
                        </ListGroupItem>

                        <ListGroupItem className="d-flex px-3 border-0">
                            <Button
                                disabled={chartData.length == 0}
                                theme="primary"
                                size="sm"
                                onClick={onSave2pdf}
                                data-tut="reactour__filemanager--save-pdf"
                            >
                                <i className="material-icons">save</i> Save as PDF
                            </Button>

                            {chartData.length !== 0 && (
                                <Button
                                    theme="secondary"
                                    outline
                                    size="sm"
                                    onClick={onCloseCsv}
                                    className="ml-auto"
                                    data-tut="reactour__filemanager--close"
                                >
                                    <i className="material-icons">close</i> Close
                                </Button>
                            )}

                            <CSVLink
                                onClick={onCsvLink}
                                data={regressionData[regressionType]?.points2.map(({ x, y }) => [x, y]) || []}
                                className="ml-auto"
                                data-tut="reactour__filemanager--save-csv"
                            >
                                <Button
                                    disabled={
                                        chartData.length === 0 || regressionData[regressionType]?.points2.length === 0
                                    }
                                    theme="secondary"
                                    size="sm"
                                >
                                    <i className="material-icons">file_copy</i> Save New csv
                                </Button>
                            </CSVLink>
                        </ListGroupItem>
                    </ListGroup>
                </CardBody>
            </Collapse>
        </Card>
    );
};

FileManagerCard.propTypes = {
    /**
     * The component's title.
     */
    title: PropTypes.string,
};

FileManagerCard.defaultProps = {
    title: 'File Manager',
};

export default FileManagerCard;
