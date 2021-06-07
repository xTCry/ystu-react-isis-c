export const avgA = (e) => e.reduce((partial_sum, a) => partial_sum + a, 0) / e.length;

export const stdCalc = (e) => {
    let mean = avgA(e);
    return Math.sqrt(e.map((x) => (x - mean) ** 2).reduce((a, b) => a + b) / e.length);
};

const floatingDivision = 3;

export const Roman = (yArr: number[], std: number) => {
    const avg = avgA(yArr);

    return yArr.map((y) => {
        const beta = Math.floor(Math.abs((avg - y) / std) * 10 ** floatingDivision) / 10 ** floatingDivision;

        return {
            y,
            beta,
            isOk: 2.16 > beta,
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

/* const isSmall = !1;
let result = ((data) => {
    const sigmaMult = 1.5;

    const yArr = data.map((e) => e.y).slice(0, isSmall ? 3 : -1);

    const std = stdCalc(yArr);
    console.log('std', yArr.join(), std);

    const roman = Roman(yArr, std);
    console.log('roman', yArr.join(), roman);

    const sigma = Sigma(yArr, std, sigmaMult);

    console.log('sigma', yArr.join(), sigma);
    console.log('std mult', std * sigmaMult);

    return data.map(e=> `${e.x};${e.y}`);
})(csv_data.slice(0, isSmall ? 20 : -1));

console.log(result); */
