const removeUndefinedKeys = (obj: any) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};

export default removeUndefinedKeys;