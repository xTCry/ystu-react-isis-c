import React from 'react';
import { XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineSeries, MarkSeries } from 'react-vis';
import 'react-vis/dist/style.css';

export class Variant2 extends React.Component<{ data: any[] }> {
    render() {
        return (
            <div className="App">
                <h1>react-vis</h1>
                {/* <XYPlot height={300} width={300}>
                    <LineSeries data={data} />
                </XYPlot> */}

                <XYPlot height={600} width={600}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <LineSeries data={this.props.data} />
                </XYPlot>

                {/* <XYPlot height={200} width={200}>
                    <VerticalBarSeries data={data} />
                </XYPlot> */}
                <XYPlot height={200} width={200}>
                    <LineSeries data={this.props.data} />
                </XYPlot>
                <XYPlot height={200} width={200}>
                    <MarkSeries data={this.props.data} />
                </XYPlot>
            </div>
        );
    }
}
