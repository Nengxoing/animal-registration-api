export const addIndexToResults = (data: any[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  return data.map((item, i) => ({
    no: startIndex + i + 1,
    ...item,
  }));
};
