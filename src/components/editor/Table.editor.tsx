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
// import debounce from 'lodash.debounce';

import { csv_data } from '../../csv_data';

const requiredRule = (value) => value?.trim().length > 0 || 'This field is required';

const columns = [
    // { name: 'id', title: 'Id' },
    { name: 'x', title: 'Год', validator: requiredRule },
    { name: 'y', title: 'Значение', validator: requiredRule },
];

const getRowId = (row) => row.id;

const FocusableCell = ({ onClick, ...restProps }: any) => <Table.Cell {...restProps} tabIndex={0} onFocus={onClick} />;

/*const EditCell = ({ errors, ...props }: any) => {
    const { children } = props;
    return (
        <TableEditColumn.Cell {...props}>
            {React.Children.map(children, (child) =>
                child?.props.id === 'commit'
                    ? React.cloneElement(child, { disabled: errors[props.tableRow.rowId] })
                    : child
            )}
        </TableEditColumn.Cell>
    );
};

// Maps the rows to a single object in which each field are is a row IDs
// and the field's value is true if the cell value is invalid (a column is required
// but the cell value is empty)
 const validate = (rows, columns) =>
    Object.entries(rows).reduce(
        (acc, [rowId, row]) => ({
            ...acc,
            [rowId]: columns.some((column) => column.required && row[column.name] === ''),
        }),
        {}
    ); */

const validate = (changed, validationStatus) =>
    Object.keys(changed).reduce((status, id) => {
        let rowStatus = validationStatus[id] || {};
        if (changed[id]) {
            rowStatus = {
                ...rowStatus,
                ...Object.keys(changed[id]).reduce((acc, field) => {
                    const validator = columns[field]?.validator(changed[id][field]);
                    return {
                        ...acc,
                        [field]: {
                            isValid: validator === true,
                            error: validator !== true && validator,
                        },
                    };
                }, {}),
            };
        }

        return { ...status, [id]: rowStatus };
    }, {});

const TableEditor = () => {
    const [rows, setRows] = useState(csv_data.map((e, i) => ({ id: i, ...e })));
    const [editingCells, setEditingCells] = useState([]);
    // const [errors, setErrors] = useState({});

    const commitChanges = ({ added, changed, deleted }: { added?: any[]; changed?: any[]; deleted?: any[] }) => {
        let changedRows;
        if (added) {
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            changedRows = [...rows, ...added.map((row, index) => ({ id: startingAddedId + index, ...row }))];
        }

        if (changed) {
            changedRows = rows.map((row) => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
            setValidationStatus({ ...validationStatus, ...validate(changed, validationStatus) });
        }

        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = rows.filter((row) => !deletedSet.has(row.id));
        }

        setRows(changedRows.map((e, i) => ({ id: i, ...e })));
    };
    const addEmptyRow = () => commitChanges({ added: [{}] });

    // const onEdited = debounce((edited) => setErrors(validate(edited, columns)), 250);

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

    return (
        <Paper>
            <Grid rows={rows} columns={columns} getRowId={getRowId}>
                <EditingState
                    onCommitChanges={commitChanges}
                    // editingRowIds={editingRowIds}
                    // onEditingRowIdsChange={setEditingRowIds}

                    // onRowChangesChange={onEdited}

                    editingCells={editingCells}
                    onEditingCellsChange={setEditingCells}
                    addedRows={[]}
                    onAddedRowsChange={addEmptyRow}
                />
                <Table cellComponent={Cell}/>
                <TableHeaderRow />
                {/* <TableEditRow /> */}
                <TableInlineCellEditing selectTextOnEditStart />
                <TableEditColumn
                    showAddCommand
                    // showEditCommand
                    showDeleteCommand
                    // cellComponent={(props) => <EditCell {...props} errors={errors} />}
                />
            </Grid>
        </Paper>
    );
};

export default TableEditor;
