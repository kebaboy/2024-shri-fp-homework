/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import { compose, __, curry, test, allPass, length, gt, lt, ifElse, andThen, prop, composeWith, tap, pipe, otherwise } from 'ramda';

// API
const api = new Api();
const getApi = api.get("https://api.tech/numbers/base");
const getFrom10To2 = (num) => getApi({ from: 10, to: 2, number: num });
const getAnimalById = (id) => api.get(`https://animals.tech/${id}`, null);

// Validation
const longerThanN = (n) => compose(gt(__, n), length);
const shorterThanN = (n) => compose(lt(__, n), length);
const longerThan2 = longerThanN(2);
const shorterThan10 = shorterThanN(10);

const isPositive = (number) => parseFloat(number) > 0;
const isDecimalNumber = test(/^[0-9]+(\.[0-9]+)?$/);

const isStrValid = allPass([
    shorterThan10,
    longerThan2,
    isPositive,
    isDecimalNumber,
])

// Transformation
const toNumber = (str) => Number(str);
const roundToNearest = Math.round;

const pow = (n, num) => Math.pow(num, n);
const curryPow = curry(pow);
const pow2 = curryPow(2);

const remainder = (d, num) => num % d;
const curryRemainder = curry(remainder);
const remainder3 = curryRemainder(3);

const chainAsync = (fn, res) => res.then(fn);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const writeLogAndReturn = tap(writeLog);
    const onError = otherwise(handleError);

    const step1 = writeLogAndReturn;
    const step2 = ifElse(
        isStrValid,
        (value) => Promise.resolve(value),
        () => Promise.reject('ValidationError'),
    );
    const step3 = compose(writeLogAndReturn, roundToNearest, toNumber);
    const step4 = composeWith(chainAsync, [writeLogAndReturn, prop("result"), getFrom10To2]);
    const step5 = compose(writeLogAndReturn, length);
    const step6 = compose(writeLogAndReturn, pow2);
    const step7 = compose(writeLogAndReturn, remainder3);
    const step8 = composeWith(chainAsync, [prop("result"), getAnimalById]);
    const step9 = handleSuccess;

    pipe(step1, step2, andThen(step3), andThen(step4), andThen(step5), andThen(step6), andThen(step7), andThen(step8), andThen(step9), onError)(value);
};

export default processSequence;
