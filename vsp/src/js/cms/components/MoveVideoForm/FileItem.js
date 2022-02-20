import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';

class FileItem extends React.Component {
  render() {
    const { series, selected } = this.props;

    return (
      <div styleName={`file-container ${selected ? 'selected' : ''}`} onClick={() => this.props.onSelect(series)}>
        <i className="fa fa-folder" aria-hidden="true" />
        <div>{series.series_name}</div>
        <div>{`(${series.summary.total})`}</div>
      </div>
    );
  }
}

FileItem.propTypes = {
  series: PropTypes.shape({
    series_id: PropTypes.number,
    series_name: PropTypes.string.isRequired,
    is_default: PropTypes.number,
    summary: PropTypes.shape({
      total: PropTypes.number.isRequired,
    }),
  }).isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

export default CSSModules(FileItem, styles, { allowMultiple: true });
