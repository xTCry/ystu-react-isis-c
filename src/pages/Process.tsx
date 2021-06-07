import { Point } from 'chart.js';
import React from 'react';
import TableEditor from '../components/editor/Table.editor';
import { TablePreview } from '../components/tablePreview.component';
import { Variant7 } from '../components/variants/Variant7';

export const Process = (props: { data: Point[] }) => {
    const columns = [
        // { name: 'id', title: 'Id' },
        { accessor: 'x', Header: 'Год' },
        { accessor: 'y', Header: 'Значение' },
    ];
    const [data, setData] = React.useState(props.data);

    return (
        <div>
            {data.length > 0 && <Variant7 data={data} />}
            {/* <TablePreview columns={columns} data={data} /> */}
            <TableEditor data={data} setData={setData} />
        </div>
    );
};
