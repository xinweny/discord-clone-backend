const formatDataUri = (buffer: Buffer, mimetype: string) => {
  const b64 = Buffer.from(buffer).toString('base64');

  const dataURI = `data:${mimetype};base64,${b64}`;

  return dataURI;
};

export default formatDataUri;