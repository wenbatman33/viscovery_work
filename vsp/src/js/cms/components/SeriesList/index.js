import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import { ContextMenu, ContextMenuProvider, Item } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.min.css';

import { NAME } from '../../constants';

import styles from './styles.scss';

class SeriesList extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    series: PropTypes.arrayOf(
      PropTypes.shape({
        series_id: PropTypes.number,
        series_name: PropTypes.string.isRequired,
        is_default: PropTypes.number,
        summary: PropTypes.shape({
          total: PropTypes.number.isRequired,
        }).isRequired,
      })
    ).isRequired,
    onSelect: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onBatchDelete: PropTypes.func,
  };

  state = {
    visible: this.props.series.map(() => false),
  };

  handleMouseOver = (event, index) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const visible = this.state.visible.slice();
    visible[index] = true;
    this.setState({
      visible,
    });
  };

  handleMouseLeave = (event, index) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const visible = this.state.visible.slice();
    visible[index] = false;
    this.setState({
      visible,
    });
  };

  handleSelect = (event, id) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.props.onSelect) {
      this.props.onSelect(id);
    }
  };

  handleUpdate = (item, target) => {
    if (this.props.onUpdate) {
      this.props.onUpdate(parseInt(target.dataset.id, 10));
    }
  };

  handleDelete = (item, target) => {
    if (this.props.onDelete) {
      this.props.onDelete(parseInt(target.dataset.id, 10));
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <ul styleName="list">
          {this.props.series.map((series, index) => (
            <li
              styleName="item"
              key={series.series_id}
              onMouseOver={event => this.handleMouseOver(event, index)}
              onMouseLeave={event => this.handleMouseLeave(event, index)}
              onClick={event => this.handleSelect(event, series.series_id)}
            >
              {series.series_name} ({series.summary.total})
              {!series.is_default && this.state.visible[index]
                ? (
                  <ContextMenuProvider styleName="action" id="series" event="onClick">
                    <i className="fa fa-cog" data-id={series.series_id} />
                  </ContextMenuProvider>
                )
                : null
              }
            </li>
          ))}
        </ul>
        <ContextMenu id="series">
          <Item label={t('edit')} onClick={this.handleUpdate} />
          <Item label={t('deleteFolder')} onClick={this.handleDelete} />
        </ContextMenu>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(SeriesList, styles));
