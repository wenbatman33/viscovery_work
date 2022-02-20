import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import R from 'ramda';
import humanize from 'humanize';

import {
  mathToZh,
} from 'utils/stringUtil';

import styles from './Rank.scss';

const sortByCount = R.sort(
  (a, b) => (
    R.prop('count')(b) - R.prop('count')(a)
  )
);

const Rank = ({ title, data }) => (
  <div
    style={{
      background: 'white',
      padding: '32px',
    }}
  >
    <h2
      styleName="title"
      style={{
        fontWeight: 'bold',
      }}
    >
      {title}
    </h2>
    {
      sortByCount(data).slice(0, 5).map((ele, index, arr) =>
        <div
          key={ele.name}
        >
          <div>
            <p
              styleName="rank"
            >
              {`第${mathToZh(index + 1)}名`}
            </p>
            <p
              styleName="username"
            >
              {ele.name}
            </p>
            <p
              styleName="count"
            >
              {humanize.numberFormat(ele.count, 0)}
            </p>
          </div>
          {
            index === arr.length - 1
              ? null :
              <hr
                styleName="line"
              />
          }
        </div>
      )
    }
  </div>
);

Rank.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
};

export default CSSModules(Rank, styles);
