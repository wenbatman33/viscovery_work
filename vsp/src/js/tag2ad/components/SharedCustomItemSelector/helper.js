export const optionFilter = (options, shared = true, pattern = null) => {
  let filtered = options.filter(o => o.shared === shared);
  if (pattern) {
    const p = pattern.toLowerCase();
    if (shared) {
      filtered = filtered.map(o => ({
        shared: o.shared,
        label: o.label,
        value: o.value,
        items: o.items.filter(v => v.label.toLowerCase().includes(p)),
      }))
        .filter(o => o.items.length);
    } else {
      filtered = filtered.filter(o => o.label.toLowerCase().includes(p));
    }
  }
  return filtered;
};

export const removeOptionByValue = (options, value) => {
  const index = options.findIndex(o => o.value === value);
  if (index > -1) {
    return [
      ...options.slice(0, index),
      ...options.slice(index + 1),
    ];
  }

  return options;
};

export const findOptionByValue = (options, value) => {
  if (!options || options.length === 0) { return null; }
  if (Array.isArray(options[0].value)) {
    options.forEach(folder => folder.filter(option => option.value === value));
    return null;
  }
  return options.find(option => option.value === value);
};

export const computeAdded = (prevOptions, nextOptions) => {
  const result = [];
  nextOptions.forEach((option) => {
    if (!findOptionByValue(prevOptions, option.value)) {
      result.push(option);
    }
  });

  return result;
};

export const computeRemoved = (prevOptions, nextOptions) => {
  const result = [];
  prevOptions.forEach((option) => {
    if (!findOptionByValue(nextOptions, option.value)) {
      result.push(option);
    }
  });

  return result;
};

export const timeStringToframe = (timeStr, fps) => {
  const timeElements = timeStr.split(':');
  const frame = (
  parseInt(timeElements[0], 10) * 3600) + (parseInt(timeElements[1], 10) * 60)
  + (parseInt(timeElements[2], 10) * fps) + 1;

  return frame;
};
