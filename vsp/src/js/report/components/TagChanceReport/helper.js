/**
 * Output a string for API call
 * @param dateObj A Date() object
 */
export const dateToString = (dateObj) => {
  const iso = dateObj.toISOString();
  return iso.split('T')[0];
};
