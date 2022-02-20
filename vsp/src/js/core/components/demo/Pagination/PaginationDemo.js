import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './PaginationDemo.scss';

import Pagination from '../../Pagination';


class PaginationDemo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeP: 3,
    };
  }
  handleSlect = (value) => {
    this.setState({
      activeP: value,
    });
  }

  render() {
    return (
      <div>
        <Pagination
          total={10}
          activePage={this.state.activeP}
          visiblePages={5}
          onSelect={this.handleSlect}
        />
      </div>
    );
  }
}

export default CSSModules(PaginationDemo, styles);
