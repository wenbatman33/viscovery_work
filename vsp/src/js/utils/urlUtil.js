const queryStrObjConvert = queryStringObj =>
  Object.keys(queryStringObj)
    .filter(key =>
      queryStringObj[key] !== undefined && queryStringObj[key] !== null)
    .map(
    key => `${key}=${queryStringObj[key]}`
  );

export const bindQueryString = url => queryStringObj =>
  `${url}${queryStrObjConvert(queryStringObj).length > 0 ? '?' : ''}${queryStrObjConvert(queryStringObj).join('&')}`;

export const addHostPrefix = (relativePath, host) => {
  const XOR = (a, b) => (a && !b) || (!a && b);
  const removeLastSlash = str => (str.endsWith('/') ? str.substring(0, str.length - 1) : str);
  const removeFirstSlash = str => (str.startsWith('/') ? str.substring(Math.min(1, str.length - 1)) : str);

  if (!relativePath && !host) {
    return '';
  }

  // either path or host has value
  if (XOR(relativePath, host)) {
    return !relativePath ? host : relativePath;
  }

  // relative path has host already
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  const newHost = removeLastSlash(host);
  const newPath = removeFirstSlash(relativePath);

  return `${newHost}/${newPath}`;
};
