import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

import CSSModules from 'react-css-modules';

import FAIcon from 'vidya/Freddicons/FAIcon';

import styles from './OptionsArea.scss';

import OptionElement from './OptionElement';

class OptionsArea extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expand: true,
    };
  }

  onChange = (value) => {
    const {
      values,
      onChange,
    } = this.props;

    if (values.includes(value)) {
      return onChange(R.filter(v => v !== value)(values));
    }
    return onChange(
      [
        ...values,
        value,
      ]
    );
  }

  handleExpand = expand =>
    this.setState({
      expand,
    })

  render() {
    const {
      optionTitle,
      options,
      values,
    } = this.props;

    const {
      expand,
    } = this.state;

    return (
      <section>
        <div
          styleName="title_area"
          onClick={() => this.handleExpand(!expand)}
        >
          <p>{optionTitle}</p>
          <FAIcon
            faClassName="fa-angle-down"
            style={{
              transform: `rotate(${expand ? 0 : -90}deg)`,
              transition: 'transform 0.2s linear',
            }}
          />
        </div>
        <div
          styleName={expand ? 'options__area__show' : 'options__area__hide'}
        >
          {
            options.map(option => (
              <OptionElement
                key={option.id}
                id={`${optionTitle}-${option.id}`}
                labelText={option.text}
                checked={values.includes(option.id)}
                onChange={() => this.onChange(option.id)}
              />
            ))
          }
        </div>
      </section>
    );
  }
}

OptionsArea.propTypes = {
  onChange: PropTypes.func,
  optionTitle: PropTypes.string,
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      text: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    })
  ),
};

export default CSSModules(OptionsArea, styles);
