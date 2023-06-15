const getPublicId = (url: string) => url.split('/').slice(-1)[0].split('.')[0];

export default getPublicId;
