import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import { Card, CardHeader, ListGroup, ListGroupItem, Slider } from 'shards-react';

import { declOfNum } from '../../utils/other.util';
import * as chartActions from '../../store/reducer/chart/actions';

const SlidersCard = () => {
    const dispatch = useDispatch();
    const [prediction, setPrediction] = React.useState(useSelector((s) => s.chart.prediction));
    const [smoothLevel, setSmoothLevel] = React.useState(useSelector((s) => s.chart.smoothLevel));
    const [sigmaMult, setSigmaMult] = React.useState(useSelector((s) => s.chart.sigmaMult));

    const handleSlidePrediction = React.useCallback(([start, end]) => {
        setPrediction(parseFloat(start));
    }, []);

    const handleSlideSmoothLevel = React.useCallback(([start, end]) => {
        setSmoothLevel(parseFloat(start));
    }, []);

    const handleSlideSigmaMult = React.useCallback(([start, end]) => {
        setSigmaMult(parseFloat(start));
    }, []);

    useDebounce/* Effect */(
        (_prediction) => {
            dispatch(chartActions.setPrediction(prediction));
        },
        300,
        [prediction],
        // prediction,
    );

    useDebounce/* Effect */(
        (_smoothLevel) => {
            dispatch(chartActions.setSmoothLevel(smoothLevel));
        },
        300,
        [smoothLevel],
        // smoothLevel,
    );

    useDebounce(
        () => {
            dispatch(chartActions.setSigmaMult(sigmaMult));
        },
        300,
        [sigmaMult],
    );

    return (
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <h6 className="m-0">Options chart</h6>
            </CardHeader>
            <ListGroup flush>
                <ListGroupItem className="px-4">
                    <div className="mb-5">
                        <strong className="text-muted d-block">
                            Прогноз на {prediction} {declOfNum(prediction, ['год', 'года', 'лет'])} вперед
                        </strong>
                        <Slider
                            theme="success"
                            className="my-3"
                            start={[prediction]}
                            onSlide={handleSlidePrediction}
                            step={1}
                            range={{ min: 0, max: 50 }}
                            connect={[true, false]}
                            pips={{ mode: 'steps', stepped: true, density: 5 }}
                        />
                    </div>
                    <div className="my-5">
                        <strong className="text-muted d-block">
                            Уровень сглаживания {smoothLevel} в 1
                        </strong>
                        <Slider
                            theme="info"
                            className="my-3"
                            start={[smoothLevel]}
                            onSlide={handleSlideSmoothLevel}
                            step={1}
                            range={{ min: 1, max: 10 }}
                            connect={[true, false]}
                            pips={{ mode: 'steps', stepped: true, density: 10 }}
                        />
                    </div>
                    <div className="my-5">
                        <strong className="text-muted d-block">
                            Коэффициент для сигмы {sigmaMult}
                        </strong>
                        <Slider
                            theme="info"
                            className="my-3"
                            start={[sigmaMult]}
                            onSlide={handleSlideSigmaMult}
                            step={0.25}
                            range={{ min: 1, max: 5 }}
                            connect={[true, false]}
                            pips={{ mode: 'steps', stepped: true, density: 3 }}
                        />
                    </div>
                </ListGroupItem>
            </ListGroup>
        </Card>
    );
};

export default SlidersCard;
