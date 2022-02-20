import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import Rx from 'rxjs/Rx';

import {
  genResult,
} from '../../utils';

import styles from './BrandsEditor.scss';

const getPosition = (client, area, content) => {
  const position = {};

  const {
    clientX,
    clientY,
  } = client;

  const {
    left: areaLeft,
    top: areaTop,
    right: areaRight,
    bottom: areaBottom,
  } = area;

  const {
    contentWidth,
    contentHeight,
  } = content;

  const datumX = areaRight - contentWidth;
  const datumY = areaBottom - contentHeight;

  position.left = clientX < datumX ? clientX : clientX - contentWidth;
  position.top = clientY < datumY ? clientY : clientY - contentHeight;

  // not over areaTop and area Left
  position.left = position.left < areaLeft ? areaLeft : position.left;
  position.top = position.top < areaTop ? areaTop : position.top;

  return position;
};

const langMapping = {
  enus: 'name',
  zhcn: 'name_zh_cn',
  zhtw: 'name_zh_tw',
};

const brandSearchFilter = searchKeyword => brand =>
  Object.values(langMapping).map(langKey => brand[langKey])
    .map(name => name.toLowerCase())
    .some(name => name.includes(searchKeyword));

class BrandsEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toHide = this.toHide.bind(this);
    this.toShow = this.toShow.bind(this);
    this.handleCurrentClass = this.handleCurrentClass.bind(this);
    this.handelUpdateClick = this.handelUpdateClick.bind(this);
    this.handleEditList = this.handleEditList.bind(this);
    this.handleLastUsedTags = this.handleLastUsedTags.bind(this);
    this.handleSearchKeyword = this.handleSearchKeyword.bind(this);
    this.pushLastUsedTags = this.pushLastUsedTags.bind(this);
    this.resetInput = this.resetInput.bind(this);

    this.state = {
      hide: true,
      position: {
        left: 0,
        top: 0,
      },
      currentClassId: '',
      editList: [],
      lastUsedTags: [],
      searchKeyword: '',
    };
  }

  componentDidMount() {
    const keyword$ = Rx.Observable.fromEvent(this.keywordInput, 'keyup');
    keyword$.debounceTime(400).subscribe(this.handleSearchKeyword);
  }

  resetInput() {
    this.keywordInput.value = '';
  }

  toHide() {
    this.setState({
      hide: true,
      position: {
        left: 0,
        top: 0,
      },
      currentClassId: '',
      editList: [],
      searchKeyword: '',
    });
    this.resetInput();
  }

  toShow(client, area, editList) {
    const {
      offsetWidth,
      offsetHeight,
    } = this.content;

    const content = {
      contentWidth: offsetWidth,
      contentHeight: offsetHeight,
    };

    const position = getPosition(client, area, content);

    this.setState({
      hide: false,
      position,
      editList,
    });
  }

  handleEditList(editList) {
    this.setState({
      editList,
    });
  }

  handleSearchKeyword(e) {
    const searchKeyword = e.target.value.toLowerCase().trim();
    if (searchKeyword !== '') {
      this.handleCurrentClass('')();
    }
    this.setState({
      searchKeyword,
    });
  }

  handleCurrentClass(classId) {
    return () => {
      this.setState({
        currentClassId: classId,
      });
    };
  }

  handleLastUsedTags(lastUsedTags) {
    this.setState({
      lastUsedTags,
    });
  }

  handelUpdateClick(editList, brandId) {
    return this.props.updateMultipleResult(editList)(genResult(3, brandId));
  }

  pushLastUsedTags(tagId) {
    const preLastUsedTags = R.take(
      9,
      this.state.lastUsedTags.filter(preTag => preTag !== tagId)
    );
    const lastUsedTags = [
      tagId,
      ...preLastUsedTags,
    ];

    this.handleLastUsedTags(lastUsedTags);
  }

  render() {
    const { hide, position, currentClassId, editList, searchKeyword } = this.state;
    const { modelId, models, classes, brands, lang } = this.props;
    const currentClasses = models[modelId] ?
      (models[modelId].classes.filter(classId => Object.keys(classes).includes(String(classId)))) :
      [];

    let currentBrands;
    let replaceWord = '<mark>$1</mark>';
    if (searchKeyword === '') {
      currentBrands = classes[currentClassId]
        ? classes[currentClassId].brands.filter(brandId =>
        Object.keys(brands).includes(String(brandId))
        ).map(brandId => brands[brandId])
        : [];
      replaceWord = '';
    } else {
      const _currentClasses = currentClasses.map(classId => classes[classId].brands);
      const currentbrandIds = [].concat.apply([], _currentClasses).filter(brandId => // eslint-disable-line
        Object.keys(brands).includes(String(brandId))
      );

      currentBrands = currentbrandIds
        .map(brandId => R.path([brandId])(brands))
        .filter(brandSearchFilter(searchKeyword));
    }

    const searchWordReg = new RegExp(`(${searchKeyword})`, 'ig');

    return (
      <div
        styleName={hide ? 'baseHide' : 'base'}
        ref={(node) => { this.base = node; }}
        onClick={(e) => {
          if (e.target === this.base) {
            this.toHide();
          }
        }}
      >
        <div
          styleName="content"
          style={{
            ...position,
          }}
          ref={(node) => { this.content = node; }}
        >
          <div
            styleName="header"
          >
            <h3>分配至新標籤</h3>
            <div
              style={{
                width: '180px',
                height: '36px',
              }}
            >
              <input
                type="text"
                ref={(node) => { this.keywordInput = node; }}
              />
            </div>
          </div>
          <div styleName="column-wrapper">
            <div styleName="gray-column">
              <div styleName="column-header">
                <p>最近使用</p>
              </div>
              <div styleName="column-content">
                {
                  this.state.lastUsedTags.map(lastTagId => (
                    <div
                      key={lastTagId}
                      styleName="element"
                      onClick={(e) => {
                        this.handelUpdateClick(editList, lastTagId)(e);
                        this.toHide();
                      }}
                    >
                      <p>
                        {brands[lastTagId][langMapping[lang]]}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
            <div styleName="column">
              <div styleName="column-header" />
              <div styleName="column-content">
                {
                  currentClasses.map(classId => (
                    <div
                      key={classId}
                      onClick={this.handleCurrentClass(classId)}
                      styleName={classId === currentClassId ? 'current-element' : 'element'}
                    >
                      <p>
                        {classes[classId][langMapping[lang]]}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
            <div styleName="column">
              <div styleName="column-header" />
              <div styleName="column-content">
                {
                  currentBrands.map(brand => (
                    <div
                      key={brand.id}
                      styleName="element"
                      onClick={(e) => {
                        this.handelUpdateClick(editList, brand.id)(e);
                        this.pushLastUsedTags(brand.id);
                        this.toHide();
                      }}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: brand[langMapping[lang]].replace(searchWordReg, replaceWord),
                        }}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BrandsEditor.propTypes = {
  modelId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  models: PropTypes.object,
  classes: PropTypes.object,
  brands: PropTypes.object,
  updateMultipleResult: PropTypes.func,
  lang: PropTypes.string,
};

export default CSSModules(BrandsEditor, styles);
