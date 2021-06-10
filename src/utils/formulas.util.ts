import * as regression from 'regression';

export const avgA = (e: number[]) => e.reduce((partial_sum, a) => partial_sum + a, 0) / e.length;

export const stdCalc = (e: number[]) => {
    let mean = avgA(e);
    if (!e.length) return 0;
    return Math.sqrt(e.map((x) => (x - mean) ** 2).reduce((a, b) => a + b) / e.length);
};

const floatingDivision = 3;

const RomanTable = {
    //      4      6     8     10    12    15    20
    p_99: [1.73, 2.16, 2.43, 2.62, 2.75, 2.9, 3.08],
    p_98: [1.72, 2.13, 2.37, 2.54, 2.66, 2.8, 2.96],
    p_95: [1.71, 2.1, 2.27, 2.41, 2.52, 2.64, 2.78],
    p_90: [1.69, 2.0, 2.17, 2.29, 2.39, 2.49, 2.62],
};

export const Roman = (yArr: number[], std: number) => {
    const avg = avgA(yArr);
    const len = yArr.length;
    const coeff =
        RomanTable.p_99[len < 5 ? 0 : len < 7 ? 1 : len < 9 ? 2 : len < 11 ? 3 : len < 13 ? 4 : len < 16 ? 5 : 5];

    return yArr.map((y) => {
        const beta = Math.floor(Math.abs((avg - y) / std) * 10 ** floatingDivision) / 10 ** floatingDivision;

        return {
            y,
            beta,
            isOk: coeff > beta,
        };
    });
};

export const Sigma = (data: number[], std: number, sigmaMult = 3) => {
    const avg = avgA(data);

    return data.map((y) => {
        const beta = Math.floor(Math.abs(avg - y) * 10 ** floatingDivision) / 10 ** floatingDivision;

        return {
            y,
            beta,
            isOk: std * sigmaMult >= beta,
        };
    });
};

export const createSmoothData = (data, smoothValue = 3) => {
    let result = [];
    for (let i = 0; i < data.length - 2; i += smoothValue) {
        const { x } = data[i];
        const y =
            data
                .slice(i, i + smoothValue)
                .map((e) => e.y)
                .reduce((a, b) => a + b) / smoothValue;
        result.push({ x, y });
    }
    result.push(data[data.length - 1]);
    return result;
};

export enum RegressionType {
    Linear = 'linear',
    Exponential = 'exponential',
    Polynomial = 'polynomial',
    // Power = 'power',
    // Logarithmic = 'logarithmic',
}
export const calcualteRegression = (type: RegressionType, dataPoints: regression.DataPoint[]) => {
    let calculation = undefined;
    let realType = type;
    if (/polynomial[34]$/.test(type)) {
        calculation.order = parseInt(type.substr(10));
        realType = type.substr(0, 10) as RegressionType;
    }

    return regression[realType](dataPoints, calculation) as regression.Result;
};
