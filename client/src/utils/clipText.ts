export const ellipsisText = (str: string, expectedLength: number) => {
  if (str.length < expectedLength || str.includes('<img')) {
    return str;
  }

  return str.slice(0, expectedLength - 1) + ' ...';
};
