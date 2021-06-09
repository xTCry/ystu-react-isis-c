import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody } from 'shards-react';
import * as pivotUtil from '../../utils/pivot.util';
import { useChartData } from '../chartData-context.component';

const PivotTableCard = ({ title }) => {
    const { chartData } = useChartData();
    const xValues = chartData.map((e) => e.x).filter((e) => typeof e === 'number');
    const yValues = chartData.map((e) => e.y).filter((e) => typeof e === 'number');

    return (
        <Card>
            <CardHeader className="border-bottom">
                <h6 className="m-0">{title}</h6>
                <div className="block-handle" />
            </CardHeader>

            <CardBody className="px-3 py-0">
                <table className="table mb-2">
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
                        {chartData.length > 0 &&
                            chartData.reduce((a, { y }) => y + a, 0) > 0 &&
                            Object.values(pivotUtil.methods).map((method, i) => {
                                const { name, formula, dOst, r, R, A, f1 } = method(xValues, yValues);
                                return (
                                    <tr key={name}>
                                        <td>{String(name)}</td>
                                        <td>{String(formula)}</td>
                                        <td>{String(dOst)}</td>
                                        <td>{String(r)}</td>
                                        <td>{String(R)}</td>
                                        <td>{String(A)}</td>
                                        <td>{String(f1)}</td>
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
