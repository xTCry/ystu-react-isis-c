import React from 'react';
import { VictoryChart, VictoryLine } from 'victory';

export class Variant1 extends React.Component<{ data: any[] }> {
    render() {
        return (
            <>
                <h1>Victory</h1>
                <VictoryChart>
                    <VictoryLine data={this.props.data} />
                </VictoryChart>
            </>
        );
    }
}
