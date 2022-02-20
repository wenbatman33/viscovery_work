import React from 'react';

import Item from './Item';
import Folder from './Folder';

const TYPE_FOLDER = 0;
const TYPE_ITEM = 1;

export const mapForType = (level = 0) => (node) => {
  if ('items' in node) {
    return {
      ...node,
      level,
      type: TYPE_FOLDER,
      items: node.items.map(mapForType(level + 1)),
    };
  }
  return {
    ...node,
    type: TYPE_ITEM,
    level,
  };
};

export const mapForRender = selectFunc => (option) => {
  const { type, level, label, value, items, ...rest } = option;
  return (
    type === TYPE_FOLDER
      ? (
        <Folder
          key={value}
          label={label}
          value={value}
          level={level}
          items={items}
          selectFunc={selectFunc}
          {...rest}
        />
      )
      : (
        <Item
          key={value}
          label={label}
          value={value}
          level={level}
          selectFunc={selectFunc}
          {...rest}
        />
      )
  );
};

export const handleIndent = level => level * 16;
