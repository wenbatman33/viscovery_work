import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import {
  createSeletable,
  SelectableGroup,
} from 'react-selectronic';

import Button from 'vidya/Button/Button';

import ReviewUnit from './ReviewUnit';
import SelectAllButton from './SelectAllButton';

import {
  genResult,
} from '../../utils';

import styles from './GroupArea.scss';

const getGroupNumber = gid => (gid.match(/\w*_(\w*)/) ? gid.match(/\w*_(\w*)/)[1] : null);

const SelectableReviewUnit = createSeletable(ReviewUnit);


class GroupArea extends React.Component {
  constructor(props) {
    super(props);

    this.selectAll = this.selectAll.bind(this);
    this.getSelectedStatus = this.getSelectedStatus.bind(this);
  }

  getSelectedStatus() {
    if (!this.props.units.map(unit => unit.id).includes(this.props.selectedList[0])) return 0;
    if (this.props.selectedList.length === 0) return 0;
    if (this.props.selectedList.length === this.props.units.length) return 2;
    return 1;
  }

  selectAll() {
    const selectedList = this.props.units.map(unit => unit.id);
    this.props.handleParentSelectedList(selectedList);
  }


  render() {
    const { currentFilter } = this.props;
    return (
      <div styleName="workspace">
        <div styleName="workspace-panel">
          <h2
            style={{
              marginRight: '15px',
            }}
          >
            {getGroupNumber(this.props.groupId) ? `群組${Number(getGroupNumber(this.props.groupId)) + 1}` : '單張圖片'}
          </h2>
          <SelectAllButton
            selectAll={this.selectAll}
            cancelSelectAll={this.props.cancelSelectAll}
            status={this.getSelectedStatus()}
          />
          <div styleName="rightPanel">
            {
              currentFilter === 2
              ? null
              : <Button
                vdStyle="secondary"
                vdSize="normal"
                style={{
                  marginRight: (currentFilter === 1) ? '0' : '8px',
                }}
                onClick={
                  this.props.updateMultipleResult(
                    this.props.units.map(unit => unit.id))(genResult(2)
                  )
                }
              >
                全部刪除
              </Button>
            }
            {
              currentFilter === 1
              ? null
              : <Button
                vdStyle="secondary"
                vdSize="normal"
                onClick={
                  this.props.updateMultipleResult(
                    this.props.units.map(unit => unit.id))(genResult(1)
                  )
                }
              >
                全部確認
              </Button>
            }
          </div>
        </div>
        <div styleName="unitArea">
          <SelectableGroup
            selectedList={this.props.selectedList}
            onChange={this.props.handleParentSelectedList}
          >
            {
              this.props.units.map(unit =>
                <SelectableReviewUnit
                  key={unit.id}
                  uid={unit.id}
                  imageHost={this.props.imageHost}
                  thumbnail={unit.img.thumbnail}
                  result={unit.result}
                  openPreviewModal={
                    this.props.openPreviewModal(
                      unit.img.preview, unit.img.rect, unit.info.content.resolution
                    )
                  }
                  updateResult={this.props.updateResult(unit.id)}
                  handleBrandsEditor={this.props.handleBrandsEditor([unit.id])}
                  currentFilter={this.props.currentFilter}
                  brandsRef={this.props.brandsRef}
                />
              )
            }
          </SelectableGroup>
        </div>
      </div>
    );
  }
}

GroupArea.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object),
  imageHost: PropTypes.string,
  groupId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  selectedList: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  currentFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  brandsRef: PropTypes.object,
  updateMultipleResult: PropTypes.func,
  updateResult: PropTypes.func,
  handleBrandsEditor: PropTypes.func,
  handleParentSelectedList: PropTypes.func,
  cancelSelectAll: PropTypes.func,
  openPreviewModal: PropTypes.func,
};

GroupArea.defaultProps = {
  units: [],
  groupId: '',
};

export default CSSModules(GroupArea, styles);
