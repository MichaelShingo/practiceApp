export const mapColorRange = (value, x1 = 1, y1 = 1, x2 = 10, y2 = 118) => {
    return ((y2 - y1) / (x2 - x1)) * value;
}