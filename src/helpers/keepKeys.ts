const keepKeys = (obj: { [key: string]: string | number }, incKeys: string[]) => {
  return Object.keys(obj)
    .filter(k => incKeys.includes(k))
    .reduce((o: { [key: string]: string | number }, k) => {
      o[k] = obj[k];
      return o;
    }, {});
};

export default keepKeys;