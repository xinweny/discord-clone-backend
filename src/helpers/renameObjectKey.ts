const renameObjectKey = (object: { [key: string]: any }, oldKey: string, newKey: string) => {
  delete Object.assign(object, { [newKey]: object[oldKey] })[oldKey];
};

export default renameObjectKey;