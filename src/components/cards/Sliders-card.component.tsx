import React from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem, Slider } from 'shards-react';
import { declOfNum } from '../../utils/other.util';

const SlidersCard = ({ changePrediction, changeSmoothLevel }) => {
    const [predictionYear, setPredictionYear] = React.useState(5);
    const [smoothLevel, setSmoothLevel] = React.useState(3);

    const handleSlidePredictionYears = React.useCallback(([start, end]) => {
        setPredictionYear(parseFloat(start));
    }, []);

    const handleSlideSmoothLevel = React.useCallback(([start, end]) => {
        setSmoothLevel(parseFloat(start));
    }, []);

    React.useEffect(() => {
        changePrediction?.(predictionYear);
    }, [predictionYear, changePrediction]);

    React.useEffect(() => {
        changeSmoothLevel?.(smoothLevel);
    }, [smoothLevel, changeSmoothLevel]);

    return (
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <h6 className="m-0">Options chart</h6>
            </CardHeader>
            <ListGroup flush>
                <ListGroupItem className="px-4">
                    <div className="mb-5">
                        <strong className="text-muted d-block">
                            Прогноз на {predictionYear} {declOfNum(predictionYear, ['год', 'года', 'лет'])} вперед
                        </strong>
                        <Slider
                            theme="info"
                            className="my-3"
                            start={[predictionYear]}
                            onSlide={handleSlidePredictionYears}
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
                </ListGroupItem>
            </ListGroup>
        </Card>
    );
};

export default SlidersCard;
