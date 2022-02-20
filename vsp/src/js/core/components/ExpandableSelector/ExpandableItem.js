import React, { PropTypes } from 'react';

import CSSModules from 'react-css-modules';

import SelectableItem from './SelectableItem';

import styles from './ExpandableItem.scss';

const propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  expanded: PropTypes.bool.isRequired,
  candidates: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ExpandableItem = ({ label, items, expanded, candidates, onClick }) => (
  <div>
    <div styleName={`${expanded ? 'expanded-' : ''}item`} onClick={() => onClick(items)}>
      {label}
    </div>
    {expanded
      ? (
        <div styleName="items">
          {items.map(option => (
            candidates.indexOf(option.value) === -1
              ? <SelectableItem
                key={option.value}
                label={option.label}
                value={option.value}
                onClick={onClick}
              />
              : null
          ))}
        </div>
      )
      : null
    }
  </div>
);

ExpandableItem.propTypes = propTypes;

export default CSSModules(ExpandableItem, styles);
