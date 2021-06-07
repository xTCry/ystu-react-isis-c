import React from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem, Slider } from 'shards-react';
import { declOfNum } from '../../utils/other.util';

const SlidersCard = ({ changePrediction }) => {
    const [startVal, setStartVal] = React.useState(0);

    const handleSlide = React.useCallback(([start, end]) => {
        setStartVal(parseFloat(start));
    }, []);

    React.useEffect(() => {
        changePrediction?.(startVal);
    }, [startVal, changePrediction]);

    return (
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <h6 className="m-0">Options chart</h6>
            </CardHeader>
            <ListGroup flush>
                <ListGroupItem className="px-3">
                    <div className="">
                        <strong className="text-muted d-block">
                            Прогноз на {startVal} {declOfNum(startVal, ['год', 'года', 'лет'])} вперед
                        </strong>
                        <Slider
                            onSlide={handleSlide}
                            start={[startVal]}
                            theme="info"
                            // className="my-4"
                            pips={{ mode: 'steps', stepped: true, density: 5 }}
                            step={1}
                            connect={[true, false]}
                            range={{ min: 0, max: 50 }}
                        />
                    </div>
                </ListGroupItem>
            </ListGroup>
        </Card>
    );
};

export default SlidersCard;
