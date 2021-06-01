import React from 'react';
import { Line } from 'react-chartjs-2';

const options = {
    // scales: {
    //     yAxes: [
    //         {
    //             ticks: {
    //                 beginAtZero: true,
    //             },
    //         },
    //     ],
    // },
};

export class Variant7 extends React.Component<{ data: any[] }> {
    render() {
        const data = {
            labels: this.props.data.map((e) => e.x),
            datasets: [
                {
                    label: '# of Years',
                    data: this.props.data.map((e) => e.y),
                    fill: true,
                    // backgroundColor: 'rgb(255, 99, 132)',
                    // borderColor: 'rgba(255, 99, 132, 0.2)',
                },
            ],
        };

        return <Line type="line" data={data} options={options} />;
    }
}
