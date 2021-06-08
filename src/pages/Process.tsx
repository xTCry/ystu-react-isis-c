import React from 'react';
import { Point } from 'chart.js';
import { TablePreview } from '../components/tablePreview.component';
// import { Variant7 } from '../components/variants/Variant7';

export const Process = (props: { data: Point[] }) => {
    const [data, setData] = React.useState(props.data);

    return (
        <div>
            {/* {data.length > 0 && <Variant7 data={data} prediction={33} />} */}
            <TablePreview data={data} />
            {/* <TableEditor data={data} setData={setData} /> */}
        </div>
    );
};
