export function getRandomFloat(min: number, max: number, decimals: number): number {
  const str: string = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

export default getRandomFloat;
