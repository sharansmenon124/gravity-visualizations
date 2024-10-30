export function normalizeMinMax(array) {
  const min = Math.min(...array);
  const max = Math.max(...array);
  console.log(min, max);

  return array.map((value) => (value - min) / (max - min));
}

export function normalizeCustomBounds(array, min, max) {
  return array.map((value) => (value - min) / (max - min));
}
