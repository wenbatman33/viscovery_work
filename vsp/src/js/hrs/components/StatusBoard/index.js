import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Button from 'vidya/Button/Button';

import {
  DropdownList,
} from 'vidya/Form';

import {
  genResult,
} from '../../utils';

import styles from './StatusBoard.scss';

const filterOptions = [
  {
    value: 'undone',
    label: '作業中',
  },
  {
    value: 1,
    label: '已確認',
  },
  {
    value: 2,
    label: '已刪除',
  },
  {
    value: 3,
    label: '已修改Tag',
  },
  /*{
    value: 4,
    label: '已鎖定',
  },*/
];

const handleMoreThanWord = limitCount => str =>
  (str.length > limitCount ? str.replace(new RegExp(`(.{${limitCount}})(.*)`), '$1...') : str);

class StatusBoard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter(option) {
    this.props.changeVisibilityFilter(option.value);
  }

  render() {
    return (
      <div styleName="container">
        <div
          styleName="toggleNav"
          onClick={this.props.toggleWorkNav}
        >
          <div styleName="vertical-center">
            <i
              className="fa fa-caret-left"
              aria-hidden="true"
            />
          </div>
        </div>
        {
          this.props.workNavShow
          ? null :
          <div styleName="videoName">
            <h3>{handleMoreThanWord(20)(this.props.videoName)}</h3>
          </div>
        }
        <p
          style={{
            marginRight: '10px',
            marginLeft: '10px',

          }}
        >
          {`${this.props.brandName}`}
        </p>
        <p
          style={{
            marginRight: '18px',
          }}
        >
          {'剩餘 '}<span styleName="river">{`${this.props.remainCount}`}</span>{' 個待操作'}
        </p>
        <div styleName="filter">
          <DropdownList
            options={filterOptions}
            value={this.props.currentFilter}
            onChange={this.handleFilter}
            placeholder="找回"
          />
        </div>
        <div styleName="rightPanel">
          <div styleName={this.props.multipleMode ? 'multiple-action' : 'hidden-multiple-action'}>
            {
              this.props.currentFilter !== 1 ?
                <Button
                  vdStyle="secondary"
                  vdSize="normal"
                  onClick={this.props.multipleAction(genResult(1))}
                  style={{
                    marginRight: '8px',
                  }}
                >
                  確認
                </Button>
              : null
            }
            <Button
              vdStyle="secondary"
              vdSize="normal"
              onClick={this.props.editTag}
              style={{
                marginRight: '8px',
              }}
            >
              修改Tag
            </Button>
            {
              this.props.currentFilter !== 2 ?
                <Button
                  vdStyle="secondary"
                  vdSize="normal"
                  onClick={this.props.multipleAction(genResult(2))}
                  style={{
                    marginRight: '8px',
                  }}
                >
                  刪除
                </Button>
              : null
            }
            {/*
              this.props.currentFilter !== 4 ?
                <Button
                  vdStyle="secondary"
                  vdSize="normal"
                  onClick={this.props.multipleAction(genResult(4))}
                >
                  鎖定
                </Button>
              : null
            */ }
          </div>
          <Button
            vdStyle="primary"
            vdSize="normal"
            onClick={this.props.submit}
            disable={this.props.disabledSubmit}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}

StatusBoard.propTypes = {
  brandName: PropTypes.string,
  videoName: PropTypes.string,
  changeVisibilityFilter: PropTypes.func,
  toggleWorkNav: PropTypes.func,
  currentFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  remainCount: PropTypes.number,
  multipleMode: PropTypes.bool,
  multipleAction: PropTypes.func,
  editTag: PropTypes.func,
  submit: PropTypes.func,
  disabledSubmit: PropTypes.bool,
  workNavShow: PropTypes.bool,
};

StatusBoard.defaultProps = {
  brandName: '',
};

export default CSSModules(StatusBoard, styles);
