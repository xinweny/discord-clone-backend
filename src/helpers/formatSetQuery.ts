const formatSetQuery = (fields: { [key: string]: any }, schemaName: string) => {
  const query: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(fields)) {
    query[`${schemaName}.$.${key}`] = value;
  }

  return query;
};

export default formatSetQuery;