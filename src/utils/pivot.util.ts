import 'numeric';
import Numeric from 'numeric';
declare const numeric: typeof Numeric;

// declare const numeric: any;

const sumFunc = (a, b) => a + b;

const avg = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

const roundNum = (num, decimal = 2) => Math.round(num * 10 ** decimal) / 10 ** decimal;

export function polyfit(xArray, yArray, order) {
    if (xArray.length <= order) console.warn('Warning: Polyfit may be poorly conditioned.');

    let xMatrix = [];
    let yMatrix = numeric.transpose([yArray]);

    for (let i = 0; i < xArray.length; i++) {
        let temp = [];

        for (let j = 0; j <= order; j++) {
            temp.push(Math.pow(xArray[i], j));
        }

        xMatrix.push(temp);
    }

    let xMatrixT = numeric.transpose(xMatrix);

    let dot1 = numeric.dot(xMatrixT, xMatrix);
    let dot2 = numeric.dot(xMatrixT, yMatrix);

    let dotInv = numeric.inv(dot1 as any);

    let coefficients = numeric.dot(dotInv, dot2);

    return coefficients;
}

export function calcLinear(xValues = [], yValues = [], decimal = 2) {
    var xyValues = xValues.map((x, i) => x * yValues[i]);
    var xSquaredValues = xValues.map((x) => x * x);

    var xSum = xValues.reduce(sumFunc);
    var ySum = yValues.reduce(sumFunc);
    var xySum = xyValues.reduce(sumFunc);
    var xSquaredSum = xSquaredValues.reduce(sumFunc);

    var count = xValues.length;

    var b = (xySum - (xSum * ySum) / count) / (xSquaredSum - (xSum * xSum) / count);
    var a = (ySum - b * xSum) / count;

    let f1Values = xValues.map((x) => a + b * x);

    var yDiff = yValues.map((y, i) => Math.pow(y - f1Values[i], 2));
    var yDiffSum = yDiff.reduce(sumFunc);

    var dOst = yDiffSum / count;

    var r =
        xValues.map((x, i) => (x - xSum / count) * (yValues[i] - ySum / count)).reduce(sumFunc) /
        Math.sqrt(
            xValues.map((x) => Math.pow(x - xSum / count, 2)).reduce(sumFunc) *
                yValues.map((y) => Math.pow(y - ySum / count, 2)).reduce(sumFunc)
        );
    var R = Math.pow(r, 2);

    var avgValues = xValues.map((x, i) => Math.abs((yValues[i] - a - b * x) / yValues[i]) * 100);

    var A = (1 / count) * avgValues.reduce(sumFunc);
    var f1 = (R * (count - 2)) / (1 - R);
    let formula = `y = ${roundNum(a, decimal)} ${b > 0 ? '+' : '-'} ${roundNum(b, decimal)}x`;

    return {
        name: 'linear',
        formula: formula,
        dOst: roundNum(dOst, decimal),
        r: roundNum(r, decimal),
        R: roundNum(R, decimal),
        A: roundNum(A, decimal),
        f1: roundNum(f1, decimal),
    };
}

export function calcParab(xValues = [], yValues = [], decimal = 2) {
    var count = xValues.length + 0.0;

    var power = 2;

    var p = polyfit(xValues, yValues, 2);

    const func = (x) => {
        var res = 0.0;

        for (let i = 0; i <= power; i++) {
            res += Math.pow(x, i) * p[i];
        }

        return res;
    };

    let f2Values = xValues.map((x) => func(x));

    var yDiff = yValues.map((y, i) => Math.pow(y - f2Values[i], 2));
    var yDiffSum = yDiff.reduce(sumFunc);

    var dOst = yDiffSum / count;

    var r = Math.sqrt(1 - yDiffSum / yValues.map((y) => Math.pow(y - avg(yValues), 2)).reduce(sumFunc));
    var R = Math.pow(r, 2);

    var avrgValues = xValues.map((x, i) => Math.abs((yValues[i] - f2Values[i]) / yValues[i]) * 100);

    var A = (1 / count) * avrgValues.reduce(sumFunc);

    var f1 = (R * (count - 3)) / (1 - R) / 2;

    var formula = 'y = ';

    for (let i = 0; i <= power; i++) {
        formula += `${i == 0 ? '' : ' + '}${roundNum(p[i], decimal)}${i == 0 ? '' : ` * x ^ ${i}`}`;
    }

    return {
        name: 'parab',
        formula: formula,
        dOst: roundNum(dOst, decimal),
        r: roundNum(r, decimal),
        R: roundNum(R, decimal),
        A: roundNum(A, decimal),
        f1: roundNum(f1, decimal),
    };
}

export function calcHyperb(xValues = [], yValues = [], decimal = 2) {
    var count = xValues.length;

    var ySum = yValues.reduce(sumFunc);

    var overXSum = xValues.map((x) => 1 / x).reduce(sumFunc);

    var b =
        (yValues.map((y, i) => y / xValues[i]).reduce(sumFunc) - (1 / count) * ySum * overXSum) /
        (xValues.map((x) => 1 / Math.pow(x, 2)).reduce(sumFunc) - (1 / count) * Math.pow(overXSum, 2));
    var a = (1 / count) * (ySum - b * overXSum);

    let f3Values = xValues.map((x) => a + b / x);

    var yDiff = yValues.map((y, i) => Math.pow(y - f3Values[i], 2));
    var yDiffSum = yDiff.reduce(sumFunc);

    var dOst = yDiffSum / count;

    var r = Math.sqrt(1 - yDiffSum / yValues.map((y) => Math.pow(y - avg(yValues), 2)).reduce(sumFunc));
    var R = Math.pow(r, 2);

    var avgValues = xValues.map((x, i) => Math.abs((yValues[i] - f3Values[i]) / yValues[i]) * 100);

    var A = (1 / count) * avgValues.reduce(sumFunc);

    var f1 = (R * (count - 2)) / (1 - R);

    let formula = `y = ${roundNum(a, decimal)} + ${roundNum(b, decimal)} / x`;
    return {
        name: 'hyperb',
        formula: formula,
        dOst: roundNum(dOst, decimal),
        r: roundNum(r, decimal),
        R: roundNum(R, decimal),
        A: roundNum(A, decimal),
        f1: roundNum(f1, decimal),
    };
}

export function calcPower(xValues = [], yValues = [], decimal = 2) {
    var count = xValues.length;

    var b =
        (yValues.map((y, i) => Math.log(y) * Math.log(xValues[i])).reduce(sumFunc) -
            (1 / count) *
                yValues.map((y) => Math.log(y)).reduce(sumFunc) *
                xValues.map((x) => Math.log(x)).reduce(sumFunc)) /
        (xValues.map((x) => Math.pow(Math.log(x), 2)).reduce(sumFunc) -
            (1 / count) * Math.pow(xValues.map((x) => Math.log(x)).reduce(sumFunc), 2));

    var a = Math.exp(
        (1 / count) *
            (yValues.map((y) => Math.log(y)).reduce(sumFunc) - b * xValues.map((x) => Math.log(x)).reduce(sumFunc))
    );

    let f5Values = xValues.map((x) => a * Math.pow(x, b));

    var yDiff = yValues.map((y, i) => Math.pow(y - f5Values[i], 2));
    var yDiffSum = yDiff.reduce(sumFunc);

    var dOst = yDiffSum / count;

    var r = Math.sqrt(1 - yDiffSum / yValues.map((y) => Math.pow(y - avg(yValues), 2)).reduce(sumFunc));
    var R = Math.pow(r, 2);

    var avrgValues = xValues.map((x, i) => Math.abs((yValues[i] - f5Values[i]) / yValues[i]) * 100);

    var A = (1 / count) * avrgValues.reduce(sumFunc);

    var f1 = (R * (count - 3)) / (1 - R) / 2;

    let formula = `y = ${roundNum(a, decimal)}x ^ ${roundNum(b, decimal)}`;
    return {
        name: 'power',
        formula: formula,
        dOst: roundNum(dOst, decimal),
        r: roundNum(r, decimal),
        R: roundNum(R, decimal),
        A: roundNum(A, decimal),
        f1: roundNum(f1, decimal),
    };
}

export function calcExp(xValues = [], yValues = [], decimal = 2) {
    var count = xValues.length;

    var B =
        (yValues.map((y, i) => Math.log(y) * xValues[i]).reduce(sumFunc) -
            (1 / count) * yValues.map((y) => Math.log(y)).reduce(sumFunc) * xValues.reduce(sumFunc)) /
        (xValues.map((x) => Math.pow(x, 2)).reduce(sumFunc) - (1 / count) * Math.pow(xValues.reduce(sumFunc), 2));

    var b = Math.exp(B);

    var a = Math.exp((1 / count) * (yValues.map((y) => Math.log(y)).reduce(sumFunc) - B * xValues.reduce(sumFunc)));

    let f6Values = xValues.map((x) => a * Math.pow(b, x));

    var yDiff = yValues.map((y, i) => Math.pow(y - f6Values[i], 2));
    var yDiffSum = yDiff.reduce(sumFunc);

    var dOst = yDiffSum / count;

    var r = Math.sqrt(1 - yDiffSum / yValues.map((y) => Math.pow(y - avg(yValues), 2)).reduce(sumFunc));
    var R = Math.pow(r, 2);

    var avrgValues = xValues.map((x, i) => Math.abs((yValues[i] - f6Values[i]) / yValues[i]) * 100);

    var A = (1 / count) * avrgValues.reduce(sumFunc);

    var f1 = (R * (count - 3)) / (1 - R) / 2;

    let formula = `y = ${roundNum(a, decimal)} * ${roundNum(b, decimal)} ^ x `;

    return {
        name: 'exp',
        formula: formula,
        dOst: roundNum(dOst, decimal),
        r: roundNum(r, decimal),
        R: roundNum(R, decimal),
        A: roundNum(A, decimal),
        f1: roundNum(f1, decimal),
    };
}

export const methods = { calcLinear, calcParab, calcHyperb, calcPower, calcExp };
