import PropTypes from 'prop-types';
import React from 'react';
import CSSModule from 'react-css-modules';

import { Ad, AdCategory, AdForm } from '../../../models';
import { startPosToTimeString } from '../../AdPodManagement/helper';
import styles from './AdList.scss';
import { findCategoryById } from '../../../utils';

class AdList extends React.Component {
  static propTypes = {
    fps: PropTypes.number,
    ads: PropTypes.arrayOf(
      PropTypes.instanceOf(Ad)
    ),
    adCategories: PropTypes.arrayOf(
      PropTypes.instanceOf(AdCategory)
    ),
    adForms: PropTypes.arrayOf(
      PropTypes.instanceOf(AdForm)
    ),
    onDelete: PropTypes.func,
    locale: PropTypes.string,
  };

  static defaultProps = {
    fps: 30,
    ads: [],
    adCategories: [],
    adForms: [],
  };

  handleDelete = (id) => {
    const { onDelete } = this.props;
    if (onDelete) {
      onDelete(id);
    }
  };

  render() {
    const { handleDelete } = this;
    const { fps, ads, adCategories, adForms, locale } = this.props;
    return ads.length && adCategories.length && adForms.length
      ? (
        <div>
          {ads.map((ad) => {
            const category = findCategoryById(adCategories, ad.filter() || ad.category());
            const form = adForms.find(f => f.id() === ad.form());
            return (
              <div styleName="ad" key={ad.id()}>
                <div styleName="start">{startPosToTimeString(ad.start(), fps)}</div>
                <div styleName="category">{category ? category.name() : null}</div>
                <div styleName="form">{form ? form.name(locale) : null}</div>
                <div styleName="action">
                  <i className="fa fa-trash" style={{ cursor: 'pointer' }} onClick={() => handleDelete(ad.id())} />
                </div>
              </div>
            );
          })}
        </div>
      )
      : null;
  }
}

export default CSSModule(AdList, styles);
