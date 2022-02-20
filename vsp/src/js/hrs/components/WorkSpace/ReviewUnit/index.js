import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import ImagePlaceholder from './ImagePlaceholder';

import Panel from './Panel';

import styles from './ReviewUnit.scss';

const langMapping = {
  enus: 'name',
  zhcn: 'name_zh_cn',
  zhtw: 'name_zh_tw',
};

class ReviewUnit extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.thumbnail === this.props.thumbnail
      && nextProps.result === this.props.result
      && nextProps.selected === this.props.selected
      && nextProps.currentFilter === this.props.currentFilter
    ) return false;
    return true;
  }

  render() {
    const {
      thumbnail,
      result: { new_brand_id },
      openPreviewModal,
      updateResult,
      handleBrandsEditor,
      selected,
      onClick,
      currentFilter,
      brandsRef,
      imageHost,
    } = this.props;
    return (
      <div styleName="outter">
        <div styleName={selected ? 'selected' : 'unselected'}>
          <div
            styleName="wrapper"
            onClick={onClick}
          >
            <div styleName="panel">
              <Panel
                openPreviewModal={openPreviewModal}
                updateResult={updateResult}
                handleBrandsEditor={handleBrandsEditor}
              />
            </div>
            <div
              styleName="img"
            >
              <ImagePlaceholder
                src={imageHost
                  ? `${imageHost}${thumbnail}`
                  : `${process.env.STATIC_HOST}${thumbnail}`
                }
                alt={'Thumbnail'}
              />
            </div>
          </div>
        </div>
        {
          currentFilter === 3 ? (
            <div styleName="editedTag">
              <p>{brandsRef[new_brand_id] ? brandsRef[new_brand_id][langMapping[this.context.locale]] : ''}</p>
            </div>
          ) : null
        }
      </div>
    );
  }
}

ReviewUnit.propTypes = {
  thumbnail: PropTypes.string,
  imageHost: PropTypes.string,
  result: PropTypes.shape({
    status: PropTypes.number,
    new_brand_id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
  openPreviewModal: PropTypes.func,
  updateResult: PropTypes.func,
  handleBrandsEditor: PropTypes.func,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  currentFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  brandsRef: PropTypes.object,
};

ReviewUnit.contextTypes = {
  locale: PropTypes.string,
};

export default CSSModules(ReviewUnit, styles);
