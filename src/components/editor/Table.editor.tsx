import React from 'react';
import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { EditingState } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditColumn,
    TableInlineCellEditing,
} from '@devexpress/dx-react-grid-material-ui';
import { useChartData } from '../chartData-context.component';

import TableMUI from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useSelector } from 'react-redux';
import { useChartDataErrors } from '../variants/Variant7';

const ruleRequired = (value) => String(value)?.trim().length > 0 || 'This field is required';
const ruleNumber = (value) => !isNaN(Number(value)) || 'This field is number';
const numberFormat = (value) => Number(value);

const columns = [
    // { name: 'id', title: 'Id' },
    { name: 'x', title: 'Год', validator: [ruleRequired, ruleNumber], format: numberFormat },
    { name: 'y', title: 'Значение', validator: [ruleRequired, ruleNumber], format: numberFormat },
];

const getRowId = (row) => row.id;

const validate = (changed, validationStatus) =>
    Object.keys(changed).reduce((status, id) => {
        let rowStatus = validationStatus[id] || {};
        if (changed[id]) {
            rowStatus = {
                ...rowStatus,
                ...Object.keys(changed[id]).reduce((acc, field) => {
                    const validators = columns.find((e) => e.name === field)?.validator || [];
                    let valid: any = true;
                    for (const validator of validators) {
                        valid = validator(changed[id][field]);
                        if (valid !== true) break;
                    }

                    return {
                        ...acc,
                        [field]: {
                            isValid: valid === true,
                            error: valid !== true && valid,
                        },
                    };
                }, {}),
            };
        }

        return { ...status, [id]: rowStatus };
    }, {});

const TableEditor = () => {
    const { roman, sigma } = useChartDataErrors();
    const { chartData, setChartData } = useChartData();
    const { regressionData, regressionType } = useSelector((state) => state.chart);
    const firstRegressionData = regressionData[regressionType];

    const [rows, setRows] = useState([]);
    const [editingCells, setEditingCells] = useState([]);

    const commitChanges = ({ added, changed, deleted }: { added?: any[]; changed?: any[]; deleted?: any[] }) => {
        let changedRows;
        if (added) {
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            changedRows = [...rows, ...added.map((row, index) => ({ id: startingAddedId + index, ...row }))];
        }

        if (changed) {
            changedRows = rows.map((row) => (changed[row.id] ? { ...row, ...(changed[row.id]) } : row));
            setValidationStatus({ ...validationStatus, ...validate(changed, validationStatus) });
        }

        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = rows.filter((row) => !deletedSet.has(row.id));
        }

        const result = changedRows
            .map((e, i) => ({
                id: i,
                ...columns.reduce((p, c) => ({ ...p, [c.name]: c.format ? c.format(e[c.name]) : e[c.name] }), {}),
            }))
            .sort((a, b) => a.x - b.x);

        // console.log('new tabele edit result', result);

        setRows(result);
        setChartData(result.map(({ x, y }) => ({ x, y })));
    };
    const addEmptyRow = () => commitChanges({ added: [{ x: 0, y: 0 }] });

    const [errorStatus, setErrorStatus] = useState({});
    const [validationStatus, setValidationStatus] = useState({});
    const Cell = React.useCallback(
        (props) => {
            const {
                tableRow: { rowId },
                column: { name: columnName },
            } = props;
            const columnStatus = validationStatus[rowId]?.[columnName];
            const valid = !columnStatus || columnStatus.isValid;
            const error = errorStatus[rowId];

            const style = {
                ...(error ? { border: '1px solid blue' } : null),
                ...(!valid ? { border: '1px solid red' } : null),
            };
            const title = valid ? '' : validationStatus[rowId][columnName].error;

            return <Table.Cell {...props} style={style} title={title} />;
        },
        [validationStatus, errorStatus]
    );

    React.useEffect(() => {
        setRows(chartData.map((e, i) => ({ id: i, ...e })));
    }, [chartData]);

    React.useEffect(() => {
        let rows = {};
        let i = 0;
        for (let s of sigma) {
            if (!s.isOk) rows[i] = 'sigma';
            ++i;
        }
        i = 0;
        for (let s of roman) {
            if (!s.isOk) rows[i] = 'roman';
            ++i;
        }
        setErrorStatus(rows);
    }, [sigma, roman, setErrorStatus]);

    return (
        <>
            <Paper>
                <Grid rows={rows} columns={columns} getRowId={getRowId}>
                    <EditingState
                        onCommitChanges={commitChanges}
                        editingCells={editingCells}
                        onEditingCellsChange={setEditingCells}
                        addedRows={[]}
                        onAddedRowsChange={addEmptyRow}
                    />
                    <Table cellComponent={Cell} />
                    <TableHeaderRow />
                    <TableInlineCellEditing selectTextOnEditStart />
                    <TableEditColumn showAddCommand showDeleteCommand />
                </Grid>
                <TableMUI>
                    <colgroup>
                        <col style={{ width: '150px' }} />
                        <col />
                        <col />
                    </colgroup>
                    <TableBody>
                        {firstRegressionData?.points2.slice(chartData.length).map((point) => (
                            <TableRow key={point.x}>
                                <TableCell />
                                <TableCell style={{ color: 'gray' }}>{point.x}</TableCell>
                                <TableCell style={{ color: 'gray' }}>{point.y}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableMUI>
            </Paper>
        </>
    );
};

export default TableEditor;
