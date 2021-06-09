import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Button } from 'shards-react';
import CSVReader from 'react-csv-reader';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';

import { useCsvData } from '../csvData-context.component';

const FileManagerCard = ({ title }) => {
    const { csvData, setCsvData } = useCsvData();
    const [status, setStatus] = React.useState('Blank');

    const [fileName, setFileName] = React.useState<string>(null);

    const save2pdf = React.useCallback(() => {
        const canvas = document.getElementById('smart-chart') as HTMLCanvasElement;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        let pdfName = 'download';
        if (fileName?.length > 0) {
            let q = fileName.split('.');
            q.length > 1 && q.pop();
            pdfName = q.join('.');
        }
        pdf.save(`${pdfName}.pdf`);
    }, []);

    const onLoaded = React.useCallback((_data, fileInfo) => {
        console.log('_data', _data);
        let data = _data
            .map(([_x, _y]) => {
                const y = Number(String(_y).replace(',', '.'));
                return { x: Number(_x), y };
            })
            .filter(({ y }) => !isNaN(y));
        console.log('loaded & parsed data', data);

        setFileName(fileInfo.name);
        setCsvData(data);
        setStatus('Loaded');
    }, []);

    return (
        <Card small className="mb-3">
            <CardHeader className="border-bottom">
                <h6 className="m-0">{title}</h6>
            </CardHeader>

            <CardBody className="p-0">
                <ListGroup flush>
                    <ListGroupItem className="p-3">
                        <span className="d-flex mb-2">
                            <i className="material-icons mr-1">flag</i>
                            <strong className="mr-1">Status:</strong> {status}
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
                            <CSVReader cssInputClass="custom-file-input" onFileLoaded={onLoaded} />
                            <label className="custom-file-label" htmlFor="custom-file-label">
                                {fileName ? `Loaded ${fileName}` : 'Choose csv file...'}
                            </label>
                        </div>
                    </ListGroupItem>

                    {csvData.length > 0 && (
                        <ListGroupItem className="d-flex px-3 border-0">
                            <Button theme="primary" size="sm" onClick={save2pdf}>
                                <i className="material-icons">save</i> Save as PDF
                            </Button>

                            <CSVLink data={csvData.map(({ x, y }) => [x, y])} className="ml-auto">
                                <Button theme="secondary" size="sm">
                                    <i className="material-icons">file_copy</i> Save New csv data
                                </Button>
                            </CSVLink>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </CardBody>
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
