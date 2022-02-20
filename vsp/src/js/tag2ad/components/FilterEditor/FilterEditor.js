import React, { PropTypes, PureComponent } from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import { routerUtil } from 'utils';

import ErrorForm from './ErrorForm';
import CriterionEditor from '../CriterionEditor';
import TagSelector from '../TagSelector';
import { NAME } from '../../constants';
import core from '../../../core';

import styles from './FilterEditor.scss';

const propTypes = {
  allowed: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  filters: PropTypes.array,
  ratiosExpanded: PropTypes.bool,
  durationsExpanded: PropTypes.bool,
  tags: PropTypes.array,
  brands: PropTypes.array,
  expanded: PropTypes.bool,
  index: PropTypes.number,
  ratios: PropTypes.array,
  durations: PropTypes.array,
  name: PropTypes.string,
  criteria: PropTypes.arrayOf(
    PropTypes.shape({
      tags: PropTypes.array.isRequired,
      ratio: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
    })
  ),
  message: PropTypes.string,
  onFilterChange: PropTypes.func,
  onNameChange: PropTypes.func,
  onRatiosClick: PropTypes.func,
  onRatiosChange: PropTypes.func,
  onDurationsClick: PropTypes.func,
  onDurationsChange: PropTypes.func,
  onCriterionAdd: PropTypes.func,
  onCriterionRemove: PropTypes.func,
  onTagAdd: PropTypes.func,
  onTagRemove: PropTypes.func,
  onTagsChange: PropTypes.func,
  onTagClose: PropTypes.func,
  onRatioChange: PropTypes.func,
  onDurationChange: PropTypes.func,
  onDrop: PropTypes.func,
  onSave: PropTypes.func,
  onMessageClear: PropTypes.func,
};

const defaultProps = {
  filters: [],
  ratiosExpanded: false,
  durationsExpanded: false,
  tags: [],
  brands: [],
  expanded: false,
  index: -1,
  ratios: [],
  durations: [],
  name: '',
  criteria: [],
  message: '',
  onFilterChange: () => {},
  onNameChange: () => {},
  onRatiosClick: () => {},
  onRatiosChange: () => {},
  onDurationsClick: () => {},
  onDurationsChange: () => {},
  onCriterionAdd: () => {},
  onCriterionRemove: () => {},
  onTagAdd: () => {},
  onTagRemove: () => {},
  onTagsChange: () => {},
  onTagClose: () => {},
  onDrop: () => {},
  onSave: () => {},
  onMessageClear: () => {},
};

class FilterEditor extends PureComponent {
  constructor(props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
  }

  componentDidMount() {
    if (!this.props.allowed) {
      this.handleNotAllowed();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.props.message && nextProps.message) {
      this.modal.switchContent(<ErrorForm message={nextProps.message} onClick={this.handleHide} />);
      this.modal.toShow();
    }

    if (!nextProps.allowed) {
      this.handleNotAllowed();
    }
  }

  handleHide() {
    this.modal.toHide();
    this.props.onMessageClear();
  }

  handleNotAllowed() {
    const content = (
      <ErrorForm
        message={this.props.t('unauthorizedAction')}
        onClick={() => {
          routerUtil.pushHistory(this.props.redirectPath);
        }}
      />
    );
    this.modal.switchContent(content);
    this.modal.toShow();
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="editor">
          <div styleName="filter">
            <div styleName="input">
              <core.components.TextInput
                placeholder={this.props.t('newFilter')}
                value={this.props.name}
                onChange={this.props.onNameChange}
              />
            </div>
            <div styleName="select">
              <core.components.MultiLevelDL
                placeholder={this.props.t('copyFilter')}
                options={this.props.filters}
                onChange={option => this.props.onFilterChange(option.value)}
              />
            </div>
            <div styleName="actions">
              <core.components.Button vdStyle="secondary" onClick={this.props.onDrop}>
                {this.props.t('drop')}
              </core.components.Button>
              <core.components.Button onClick={this.props.onSave}>
                {this.props.t('save')}
              </core.components.Button>
            </div>
          </div>
          <div styleName="header">
            <div styleName="tags">{this.props.t('includedTags')}</div>
            <div styleName="ratio">
              {this.props.t('ratio')}
              <div styleName="icon" onClick={this.props.onRatiosClick}>
                <i className="fa fa-pencil" />
                {this.props.ratiosExpanded
                  ? (
                    <div>
                      <core.components.Tooltip>
                        {this.props.ratios.map(ratio => (
                          <div
                            styleName="option"
                            key={ratio.value}
                            onClick={() => this.props.onRatiosChange(ratio.value)}
                          >
                            {ratio.label}
                          </div>
                        ))}
                      </core.components.Tooltip>
                    </div>
                  )
                  : null
                }
              </div>
            </div>
            <div styleName="duration">
              {this.props.t('duration')}
              <div styleName="icon" onClick={this.props.onDurationsClick}>
                <i className="fa fa-pencil" />
                {this.props.durationsExpanded
                  ? (
                    <div>
                      <core.components.Tooltip>
                        {this.props.durations.map(duration => (
                          <div
                            styleName="option"
                            key={duration.value}
                            onClick={() => this.props.onDurationsChange(duration.value)}
                          >
                            {duration.label}
                          </div>
                        ))}
                      </core.components.Tooltip>
                    </div>
                  )
                  : null
                }
              </div>
            </div>
            <div styleName="actions" />
          </div>
          <div styleName="criteria">
            {this.props.criteria.map((criterion, index) => (
              <div key={index} styleName="criterion">
                {index
                  ? <div styleName="divider">{this.props.t('or')}</div>
                  : null
                }
                <CriterionEditor
                  tags={this.props.brands.filter(
                    brand => this.props.criteria[index].tags.includes(brand.value)
                  )}
                  ratios={this.props.ratios}
                  ratio={this.props.criteria[index].ratio}
                  durations={this.props.durations}
                  duration={this.props.criteria[index].duration}
                  onTagAdd={() => this.props.onTagAdd(index)}
                  onTagRemove={value => this.props.onTagRemove(index, value)}
                  onRatioChange={value => this.props.onRatioChange(index, value)}
                  onDurationChange={value => this.props.onDurationChange(index, value)}
                  onRemove={() => this.props.onCriterionRemove(index)}
                />
              </div>
            ))}
            <div styleName="button">
              <div onClick={this.props.onCriterionAdd}>{this.props.t('newCriterion')}</div>
            </div>
          </div>
        </div>
        <div styleName={`${this.props.expanded ? 'expanded-' : ''}selector`}>
          <TagSelector
            options={this.props.tags}
            value={this.props.index >= 0 ? this.props.criteria[this.props.index].tags : []}
            onChange={value => this.props.onTagsChange(this.props.index, value)}
            onClose={this.props.onTagClose}
          />
        </div>
        <core.components.Modal
          headerHide
          ref={(node) => { this.modal = node; }}
        />
      </div>
    );
  }
}

FilterEditor.propTypes = propTypes;
FilterEditor.defaultProps = defaultProps;

export default translate([NAME])(CSSModules(FilterEditor, styles));
