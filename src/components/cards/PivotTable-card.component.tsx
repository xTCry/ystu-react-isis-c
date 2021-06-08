import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody } from 'shards-react';
import * as pivotUtil from '../../utils/pivot.util';
import { useCsvData } from '../csvData-context.component';

const PivotTableCard = ({ title }) => {
    const { csvData } = useCsvData();
    const xValues = csvData.map((e) => e.x).filter((e) => typeof e === 'number');
    const yValues = csvData.map((e) => e.y).filter((e) => typeof e === 'number');

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
                        {csvData.length > 0 &&
                            csvData.reduce((a, { y }) => y + a, 0) > 0 &&
                            Object.values(pivotUtil.methods).map((method, i) => {
                                const { name, formula, dOst, r, R, A, f1 } = method(xValues, yValues);
                                return (
                                    <tr key={name}>
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
        </Card>
    );
};

PivotTableCard.propTypes = {
    /**
     * The component's title.
     */
    title: PropTypes.string,
};

PivotTableCard.defaultProps = {
    title: 'Pivot Table',
};

export default PivotTableCard;
