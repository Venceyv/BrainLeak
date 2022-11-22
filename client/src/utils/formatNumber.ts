const ranges = [
  { divider: 1e18, suffix: 'E' },
  { divider: 1e15, suffix: 'P' },
  { divider: 1e12, suffix: 'T' },
  { divider: 1e9, suffix: 'G' },
  { divider: 1e6, suffix: 'M' },
  { divider: 1e3, suffix: 'k' },
];

export const formatNumber = (num: string | number) => {
  if (typeof num === 'string') {
    num = Number(num);
  }

  for (let i = 0; i < ranges.length; i++) {
    if (num >= ranges[i].divider) {
      return (num / ranges[i].divider).toString() + ranges[i].suffix;
    }
  }
  console.log(num);
  return num;
};
