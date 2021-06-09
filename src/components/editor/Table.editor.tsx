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
// import debounce from 'lodash.debounce';

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
    const { chartData, setChartData } = useChartData();

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

        console.log('new tabele edit result', result);

        setRows(result);
        setChartData(result.map(({ x, y }) => ({ x, y })));
    };
    const addEmptyRow = () => commitChanges({ added: [{ x: 0, y: 0 }] });

    const [validationStatus, setValidationStatus] = useState({});
    const Cell = React.useCallback(
        (props) => {
            const {
                tableRow: { rowId },
                column: { name: columnName },
            } = props;
            const columnStatus = validationStatus[rowId]?.[columnName];
            const valid = !columnStatus || columnStatus.isValid;

            const style = {
                ...(!valid ? { border: '1px solid red' } : null),
            };
            const title = valid ? '' : validationStatus[rowId][columnName].error;

            return <Table.Cell {...props} style={style} title={title} />;
        },
        [validationStatus]
    );

    React.useEffect(() => {
        setRows(chartData.map((e, i) => ({ id: i, ...e })));
    }, [chartData]);

    return (
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
        </Paper>
    );
};

export default TableEditor;
