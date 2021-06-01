import React from 'react';
import { VictoryAxis, VictoryBrushContainer, VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import { DomainTuple } from 'victory-core';

export class Variant4 extends React.Component<{ data: any[] }, { zoomDomain: { x: DomainTuple } }> {
    constructor(props) {
        super(props);
        this.state = {
            zoomDomain: { x: [1960, 1980] },
        };
    }

    handleZoom(zoomDomain) {
        this.setState({ zoomDomain });
    }

    render() {
        return (
            <div>
                <VictoryChart
                    width={600}
                    height={470}
                    scale={{ x: 'time' }}
                    containerComponent={
                        <VictoryZoomContainer
                            zoomDimension="x"
                            zoomDomain={this.state.zoomDomain}
                            onZoomDomainChange={this.handleZoom.bind(this)}
                        />
                    }
                >
                    <VictoryLine
                        style={{
                            data: { stroke: 'tomato' },
                        }}
                        data={this.props.data}
                    />
                </VictoryChart>
                <VictoryChart
                    padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                    width={600}
                    height={100}
                    scale={{ x: 'time' }}
                    containerComponent={
                        <VictoryBrushContainer
                            brushDimension="x"
                            brushDomain={this.state.zoomDomain}
                            onBrushDomainChange={this.handleZoom.bind(this)}
                        />
                    }
                >
                    <VictoryAxis tickFormat={(x) => new Date(x).getFullYear()} />
                    <VictoryLine
                        style={{
                            data: { stroke: 'tomato' },
                        }}
                        data={this.props.data}
                    />
                </VictoryChart>
            </div>
        );
    }
}
