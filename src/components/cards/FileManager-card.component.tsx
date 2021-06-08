import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Button } from 'shards-react';
import CSVReader from 'react-csv-reader'

const FileManagerCard = ({ title }) => {
    const [status, setStatus] = React.useState('Blank');

    const [fileName, setFileName] = React.useState(null);

    const onLoaded = React.useCallback((data, fileInfo) => {
        setFileName(fileInfo.name);
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
                        <span className="d-flex mb-2">
                            <i className="material-icons mr-1">visibility</i>
                            <strong className="mr-1">Visibility:</strong>
                            <strong className="text-success">Public</strong>
                        </span>
                        {/* <span className="d-flex mb-2">
                            <i className="material-icons mr-1">calendar_today</i>
                            <strong className="mr-1">Saved:</strong>
                            Now
                        </span> */}
                        <span className="d-flex">
                            <i className="material-icons mr-1">score</i>
                            <strong className="mr-1">Changed:</strong>
                            <strong className="text-success">True</strong>
                        </span>
                    </ListGroupItem>

                    <hr className="my-2"/>

                    <ListGroupItem className="px-3 py-0">
                        <strong className="text-muted d-block mb-2">Load csv file</strong>
                        <div className="custom-file mb-3">
                            <CSVReader cssInputClass="custom-file-input" onFileLoaded={onLoaded} />
                            <label className="custom-file-label" htmlFor="custom-file-label">
                                {fileName ? `Loaded ${fileName}` : 'Choose csv file...'}
                            </label>
                        </div>
                    </ListGroupItem>

                    <ListGroupItem className="d-flex px-3 border-0">
                        <Button theme="accent" size="sm">
                            <i className="material-icons">save</i> Save as PDF
                        </Button>

                        <Button theme="accent" size="sm" className="ml-auto">
                            <i className="material-icons">file_copy</i> Save New csv data
                        </Button>
                    </ListGroupItem>
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
