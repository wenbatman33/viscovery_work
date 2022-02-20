import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import FilterEditor from '../components/FilterEditor';
import { createFilter, getFilterList, queryAllTags, requestScreenRatios, setMessage, updateFilter } from '../actions';
import { filtersApi } from '../api';
import { NAME, PATH } from '../constants';
import { Filter } from '../models';
import {
  getCustomFilters,
  getLocale,
  getScreenRatios,
  getSharedFilters,
  getTagBrands,
  getTags,
  getUser,
} from '../selectors';
import { LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../app/constants';
import {
  getUserIdByUser,
  isFilterCreator,
} from '../utils';
import { routerUtil, LogUtil } from '../../utils';

const mapStateToProps = createStructuredSelector({
  models: getTags,
  brands: getTagBrands,
  ratios: getScreenRatios,
  sharedFilters: getSharedFilters,
  customFilters: getCustomFilters,
  locale: getLocale,
  user: getUser,
});

const mapDispatchToProps = dispatch => ({
  createFilter: filter => dispatch(createFilter(filter)),
  getFilterList: locale => dispatch(getFilterList(locale)),
  requestRatios: () => dispatch(requestScreenRatios()),
  requestTags: locale => dispatch(queryAllTags(locale)),
  updateFilter: (id, filter) => dispatch(updateFilter(id, filter)),
  setMessage: message => dispatch(setMessage(message)),
});

const redirectPath = campaignId => `${PATH.CHANCE_SEARCH}/${campaignId}?custom_filter=1`;

const createRatioOptions = (ratios, locale, t) => {
  const options = [];
  for (const ratio of ratios) {
    const name = (locale === LOCALE_ZH_TW && ratio.name_zh_tw)
      || (locale === LOCALE_ZH_CN && ratio.name_zh_cn)
      || ratio.name;
    options.push({
      label: ratio.percentage ? t('ratioOption', { name, percentage: ratio.percentage }) : name,
      value: ratio.level,
    });
  }
  return options;
};

class FilterEditorContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filters: [],
      ratiosExpanded: false,
      durationsExpanded: false,
      tags: [],
      brands: [],
      expanded: false,
      index: -1,
      ratios: createRatioOptions(props.ratios, props.locale, props.t),
      durations: [1, 2, 3, 5, 10, 15].map(duration => ({
        label: props.t('durationOption', { seconds: duration }),
        value: duration,
      })),
      name: '',
      criteria: [],
      message: '',
      allowed: true,
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleRatiosClick = this.handleRatiosClick.bind(this);
    this.handleRatiosChange = this.handleRatiosChange.bind(this);
    this.handleDurationsClick = this.handleDurationsClick.bind(this);
    this.handleDurationsChange = this.handleDurationsChange.bind(this);
    this.handleCriterionAdd = this.handleCriterionAdd.bind(this);
    this.handleCriterionRemove = this.handleCriterionRemove.bind(this);
    this.handleTagAdd = this.handleTagAdd.bind(this);
    this.handleTagRemove = this.handleTagRemove.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleTagClose = this.handleTagClose.bind(this);
    this.handleRatioChange = this.handleRatioChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleMessageClear = this.handleMessageClear.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    this.props.getFilterList(this.props.locale);
    this.props.requestRatios();
    this.props.requestTags(this.props.locale);

    if (this.props.match.params.id) {
      filtersApi.requestFilter(this.props.match.params.id)
        .then((response) => {
          const data = response.response_data;
          const criteria = data.filter_content.criteria.map(criterion => ({
            tags: criterion.brand_ids,
            ratio: criterion.ratio,
            duration: criterion.duration / 1000,
          }));
          this.setState({
            name: data.filter_name,
            criteria,
            allowed: isFilterCreator(data, getUserIdByUser(this.props.user)),
          });
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      nextProps.getFilterList(nextProps.locale);
      nextProps.requestTags(nextProps.locale);

      this.setState({
        ratios: createRatioOptions(nextProps.ratios, nextProps.locale, nextProps.t),
      });
    }

    if (nextProps.ratios !== this.props.ratios) {
      this.setState({
        ratios: createRatioOptions(nextProps.ratios, nextProps.locale, nextProps.t),
      });
    }

    if (nextProps.sharedFilters !== this.props.sharedFilters) {
      const filters = [];
      for (const group of nextProps.sharedFilters) {
        const items = [];
        const children = group.children();
        for (const filter of children) {
          if (filter) {
            items.push({
              label: filter.name(),
              value: filter.id(),
            });
          }
        }
        filters.push({
          label: group.name(),
          value: group.id(),
          items,
        });
      }
      this.setState({
        filters,
      });
    }

    if (nextProps.models !== this.props.models || nextProps.brands !== this.props.brands) {
      const tags = [];
      for (const model of nextProps.models) {
        const brands = nextProps.brands.filter(brand => brand.model_id === model.id);
        const items = [];
        for (const brand of brands) {
          items.push({
            label: brand.name,
            value: brand.id,
          });
        }
        tags.push({
          label: model.name[0].toUpperCase() + model.name.slice(1),
          value: model.id,
          items,
        });
      }
      this.setState({
        tags,
        brands: [].concat(...tags.map(option => option.items)),
      });
    }

    if (nextProps.match.params.id !== this.props.match.params.id) {
      if (nextProps.match.params.id) {
        filtersApi.requestFilter(nextProps.match.params.id)
          .then((response) => {
            const data = response.response_data;
            const criteria = data.filter_content.criteria.map(criterion => ({
              tags: criterion.brand_ids,
              ratio: criterion.ratio,
              duration: criterion.duration / 1000,
            }));
            this.setState({
              name: data.filter_name,
              criteria,
              allowed: isFilterCreator(data, getUserIdByUser(nextProps.user)),
            });
          });
      } else {
        this.setState({
          ratiosExpanded: false,
          durationsExpanded: false,
          expanded: false,
          index: -1,
          name: '',
          criteria: [],
          message: '',
        });
      }
    }
  }

  handleFilterChange(value) {
    filtersApi.requestFilter(value)
      .then((response) => {
        const data = response.response_data;
        const criteria = data.filter_content.criteria.map(criterion => ({
          tags: criterion.brand_ids,
          ratio: criterion.ratio,
          duration: criterion.duration / 1000,
        }));
        this.setState({
          criteria,
        });
      });
  }

  handleNameChange(value) {
    this.setState({
      name: value,
    });
  }

  handleRatiosClick() {
    this.setState({
      ratiosExpanded: !this.state.ratiosExpanded,
      durationsExpanded: false,
    });
  }

  handleRatiosChange(value) {
    const criteria = [];

    this.state.criteria.forEach((criterion) => {
      const c = Object.assign({}, criterion,
        {
          ratio: value,
        }
      );
      criteria.push(c);
    });

    this.setState({
      criteria,
    });
  }

  handleDurationsClick() {
    this.setState({
      durationsExpanded: !this.state.durationsExpanded,
      ratiosExpanded: false,
    });
  }

  handleDurationsChange(value) {
    const criteria = [];
    this.state.criteria.forEach((criterion) => {
      const c = Object.assign({}, criterion,
        {
          duration: value,
        },
      );
      criteria.push(c);
    });

    this.setState({
      criteria,
    });
  }

  handleCriterionAdd() {
    const criteria = this.state.criteria.slice();
    criteria.push({
      tags: [],
      ratio: 0,
      duration: 3,
    });
    this.setState({
      criteria,
    });
  }

  handleCriterionRemove(index) {
    const criteria = this.state.criteria.slice();
    criteria.splice(index, 1);
    this.setState({
      expanded: this.state.index !== index && this.state.expanded,
      index: this.state.index === index ?
        -1 :
        this.state.index - (this.state.index > index ? 1 : 0),
      criteria,
    });
  }

  handleTagAdd(index) {
    this.setState({
      expanded: true,
      index,
    });
  }

  handleTagRemove(index, value) {
    const criteria = this.state.criteria.slice();
    const criterion = Object.assign({}, criteria[index], {
      tags: criteria[index].tags.filter(tag => tag !== value),
    });
    criteria.splice(index, 1, criterion);
    this.setState({
      criteria,
    });
  }

  handleTagsChange(index, value) {
    const criteria = this.state.criteria.slice();
    const criterion = Object.assign({}, criteria[index], {
      tags: value,
    });
    criteria.splice(index, 1, criterion);
    this.setState({
      criteria,
    });
  }

  handleTagClose() {
    this.setState({
      expanded: false,
      index: -1,
    });
  }

  handleRatioChange(index, value) {
    const criteria = this.state.criteria.slice();
    const criterion = Object.assign({}, criteria[index], {
      ratio: value,
    });
    criteria.splice(index, 1, criterion);
    this.setState({
      criteria,
    });
  }

  handleDurationChange(index, value) {
    const criteria = this.state.criteria.slice();
    const criterion = Object.assign({}, criteria[index], {
      duration: value,
    });
    criteria.splice(index, 1, criterion);
    this.setState({
      criteria,
    });
  }

  handleSave() {
    if (!this.state.name) {
      this.setState({
        message: this.props.t('emptyFilterName'),
      });
      return;
    }
    const duplicate = this.props.customFilters.some(
      filter => filter.name() === this.state.name && filter.id() !== this.props.match.params.id
    );
    if (duplicate) {
      this.setState({
        message: this.props.t('duplicateFilterName'),
      });
      return;
    }
    const empty = !this.state.criteria.length || this.state.criteria.some(criterion => (
        !criterion.tags.length || criterion.ratio === -1 || criterion.duration === -1
      ));
    if (empty) {
      this.setState({
        message: this.props.t('emptyCriterion'),
      });
      return;
    }
    let conflict = false;
    for (let i = 0; i < this.state.criteria.length - 1; i += 1) {
      const criterion = this.state.criteria[i].tags.sort();
      for (let j = i + 1; j < this.state.criteria.length; j += 1) {
        const anotherCriterion = this.state.criteria[j].tags.sort();
        if (_.isEqual(criterion, anotherCriterion)) {
          conflict = true;
          break;
        }
        if (conflict) {
          break;
        }
      }
    }
    if (conflict) {
      LogUtil.log(this.state.criteria);
      this.setState({
        message: this.props.t('criterionConflict'),
      });
      return;
    }

    const criteria = this.state.criteria.map(criterion => ({
      brand_ids: criterion.tags,
      ratio: criterion.ratio,
      duration: criterion.duration * 1000,
      included: true,
    }));
    const filter = new Filter();
    filter.name(this.state.name);
    filter.criteria(criteria);
    if (this.props.match.params.id) {
      this.props.updateFilter(this.props.match.params.id, filter)
        .then(() => {
          this.props.setMessage(this.props.t('filterSaved'));
          setTimeout(() => {
            this.props.setMessage(null);
          }, 3000);
          routerUtil.pushHistory(redirectPath(this.props.match.params.campaign));
        });
    } else {
      this.props.createFilter(filter)
        .then(() => {
          this.props.setMessage(this.props.t('filterSaved'));
          routerUtil.pushHistory(redirectPath(this.props.match.params.campaign));
        });
    }
  }

  handleMessageClear() {
    this.setState({
      message: '',
    });
  }

  handleDrop() {
    const campaignId = this.props.match.params.campaign;
    routerUtil.pushHistory(redirectPath(campaignId));
  }

  render() {
    return (
      <FilterEditor
        allowed={this.state.allowed}
        redirectPath={redirectPath(this.props.match.params.campaign)}
        filters={this.state.filters}
        ratiosExpanded={this.state.ratiosExpanded}
        durationsExpanded={this.state.durationsExpanded}
        tags={this.state.tags}
        brands={this.state.brands}
        expanded={this.state.expanded}
        index={this.state.index}
        ratios={this.state.ratios}
        durations={this.state.durations}
        name={this.state.name}
        criteria={this.state.criteria}
        message={this.state.message}
        onFilterChange={this.handleFilterChange}
        onNameChange={this.handleNameChange}
        onRatiosClick={this.handleRatiosClick}
        onRatiosChange={this.handleRatiosChange}
        onDurationsClick={this.handleDurationsClick}
        onDurationsChange={this.handleDurationsChange}
        onCriterionAdd={this.handleCriterionAdd}
        onCriterionRemove={this.handleCriterionRemove}
        onTagAdd={this.handleTagAdd}
        onTagRemove={this.handleTagRemove}
        onTagsChange={this.handleTagsChange}
        onTagClose={this.handleTagClose}
        onRatioChange={this.handleRatioChange}
        onDurationChange={this.handleDurationChange}
        onDrop={this.handleDrop}
        onSave={this.handleSave}
        onMessageClear={this.handleMessageClear}
      />
    );
  }
}


FilterEditorContainer.propTypes = {
  t: PropTypes.func,
  ratios: PropTypes.array,
  locale: PropTypes.string,
  models: PropTypes.array,
  brands: PropTypes.array,
  sharedFilters: PropTypes.array,
  customFilters: PropTypes.array,
  user: PropTypes.object,
  createFilter: PropTypes.func,
  getFilterList: PropTypes.func,
  requestRatios: PropTypes.func,
  requestTags: PropTypes.func,
  updateFilter: PropTypes.func,
  setMessage: PropTypes.func,
  routeParams: PropTypes.object,
  route: PropTypes.object,
  match: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  translate([NAME])(FilterEditorContainer)
);
