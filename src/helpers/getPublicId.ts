const getPublicId = (url: string, raw = false) => {
  const path = url.split('/').slice(7).join('/');
  
  return (raw) ? path : path.split('.')[0];
}

export default getPublicId;
