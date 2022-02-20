import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import TableRow from './TableRow';
import TableCell from './TableCell';
import { NAME } from '../../constants';

import styles from './styles.scss';

class TopTagsTable extends React.Component {
  genCells = () => {
    const { colors } = this.props;
    return this.props.data.map((d, index) => (
      <TableCell
        key={d.label}
        circleColor={colors[(index + 1) % colors.length]}
        label={d.label}
        number={d.value}
      />
    ));
  };

  renderRows = () => {
    const { t } = this.props;
    const cells = this.genCells();
    const rows = [];

    // 10 cells in the table
    for (let i = 0; i < Math.min(cells.length, 5); i += 1) {
      const items = [];
      items.push(cells[i]);
      if (i + 5 < cells.length) {
        items.push(cells[i + 5]);
      }
      const row = (
        <TableRow key={i} cells={items} />
      );
      rows.push(row);
    }
    return rows.length > 0 ? rows : t('tagsUnavailable');
  };

  render() {
    const { t } = this.props;
    return (
      <div styleName="tag-table">
        <h2 styleName="tag-table-caption">{t('topTags')}</h2>
        {this.renderRows()}
      </div>
    );
  }
}

TopTagsTable.defaultProps = {
  data: [],
};
TopTagsTable.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })),
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default translate([NAME])(CSSModules(TopTagsTable, styles));
