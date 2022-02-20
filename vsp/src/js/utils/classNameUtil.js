export const toGray = ifGray => (
  className =>
    (ifGray ? `gray-${className}` : `${className}`)
);
