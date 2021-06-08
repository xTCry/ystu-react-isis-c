import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardFooter, Row, Col } from 'shards-react';
import * as pivotUtil from '../../utils/pivot.util';

const PivotTableCard = ({ title, data }) => {
    const xValues = data.map((e) => e.x).filter((e) => typeof e === 'number');
    const yValues = data.map((e) => e.y).filter((e) => typeof e === 'number');

    return (
        <Card>
            <CardHeader className="border-bottom">
                <h6 className="m-0">{title}</h6>
                <div className="block-handle" />
            </CardHeader>

            <CardBody className="p-0">
                <table className="table mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th scope="col" className="border-0">
                                Название
                            </th>
                            <th scope="col" className="border-0">
                                Функция
                            </th>
                            <th scope="col" className="border-0">
                                Остаточная дисперсия
                            </th>
                            <th scope="col" className="border-0">
                                Коэффициент корреляции
                            </th>
                            <th scope="col" className="border-0">
                                Коэффициент детерминации
                            </th>
                            <th scope="col" className="border-0">
                                Средняя ошибка аппроксимации
                            </th>
                            <th scope="col" className="border-0">
                                F-критерий Фишера
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(pivotUtil.methods).map((method) => {
                            const { name, formula, dOst, r, R, A, f1 } = method(xValues, yValues);
                            return (
                                <tr>
                                    <td>{name}</td>
                                    <td>{formula}</td>
                                    <td>{dOst}</td>
                                    <td>{r}</td>
                                    <td>{R}</td>
                                    <td>{A}</td>
                                    <td>{f1}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>

            {/* <CardFooter className="border-top">
                <Row>
                    <Col className="text-right view-report">
                        <a href="#">View full &rarr;</a>
                    </Col>
                </Row>
            </CardFooter> */}
        </Card>
    );
};

PivotTableCard.propTypes = {
    /**
     * The component's title.
     */
    title: PropTypes.string,
    /**
     * The referral data.
     */
    data: PropTypes.array,
};

PivotTableCard.defaultProps = {
    title: 'Pivot Table',
    data: [],
};

export default PivotTableCard;
