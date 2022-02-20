import { PATH } from '../../constants';

export const isChildPath = (currentPathName, childPath) => {
  const current = stripLastSlash(currentPathName);
  const child = stripLastSlash(childPath);

  return current.startsWith(child);
};

export const stripFromStart = (path, stripped) => {
  if (path.startsWith(stripped)) {
    return path.substring(stripped.length);
  }

  return path;
};

const stripLastSlash = (pathName) => {
  if (pathName.length <= 1) {
    return pathName;
  }

  if (pathName.endsWith('/')) {
    return pathName.substring(0, pathName.length - 1);
  }

  return pathName;
};

export const pathnameToEventKey = (location) => {
  if (isChildPath(location, PATH.CHANCE_SEARCH)) {
    return 1;
  } else if (isChildPath(location, PATH.AD_POD_SEARCH)) {
    return 2;
  }
  return null;
};
