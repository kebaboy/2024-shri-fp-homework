/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import { all, any, equals, prop, allPass, compose, omit, values, length, filter, not, gte, __, countBy, identity, without, partial } from 'ramda';

const getColors = values;
const getColor = prop;
const isColor = equals;
const isShapeColor = (shape, color) => compose(isColor(color), getColor(shape));

const isCircleBlue = isShapeColor("circle", "blue");
const isSquareGreen = isShapeColor("square", "green");
const isTriangleWhite = isShapeColor("triangle", "white");
const isTriangleGreen = isShapeColor("triangle", "green");
const isStarRed = isShapeColor("star", "red");
const isStarWhite = isShapeColor("star", "white");
const isSquareOrange = isShapeColor("square", "orange");

const countColorShapes = (color) => compose(length, filter(isColor(color)), getColors);
const countGreenShapes = countColorShapes("green");
const countRedShapes = countColorShapes("red");
const countBlueShapes = countColorShapes("blue");

const isAllShapesColor = (color) => compose(all(isColor(color)), getColors);
const isAllShapesWhite = isAllShapesColor("white");
const isAllShapesOrange = isAllShapesColor("orange");
const isAllShapesGreen = isAllShapesColor("green");

const atLeastNGreenShapes = (n) => compose(gte(__, n), countGreenShapes);

const countShapesByColor = countBy(identity);
const isAtLeastThree = gte(__, 3);

const excludeShapes = (shapesToExclude) => partial(omit, [shapesToExclude]);
const apartFromColors = (colorsToExclude) => partial(without, [colorsToExclude]);

const areCountsEqual = (countFn1, countFn2) => (shapes) =>
    equals(countFn1(shapes), countFn2(shapes));

const hasExactlyTwoGreenShapes = (shapes) => equals(countGreenShapes(shapes), 2);
const hasExactlyOneRedShape = (shapes) => equals(countRedShapes(shapes), 1);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isStarRed,
    isSquareGreen,
    compose(isAllShapesWhite, excludeShapes(["star", "square"]))
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = atLeastNGreenShapes(2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = areCountsEqual(countRedShapes, countBlueShapes);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    isCircleBlue,
    isStarRed,
    isSquareOrange
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    any(isAtLeastThree),
    values,
    countShapesByColor,
    apartFromColors(["white"]),
    getColors
)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    isTriangleGreen,
    hasExactlyTwoGreenShapes,
    hasExactlyOneRedShape
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = isAllShapesOrange;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    compose(not, isStarRed),
    compose(not, isStarWhite),
])

// 9. Все фигуры зеленые.
export const validateFieldN9 = isAllShapesGreen;

const isTriangleEqualSquare = (shapes) =>
    equals(getColor('triangle')(shapes), getColor('square')(shapes));
// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    compose(not, isTriangleWhite),
    isTriangleEqualSquare
])

