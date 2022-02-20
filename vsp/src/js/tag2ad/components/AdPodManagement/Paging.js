import React from 'react';
import PropTypes from 'prop-types';
import { Interpolate } from 'react-i18next';

import Pagination from '../Pagination';
import { totalPageNum } from '../../utils';


const Paging = props => (
  <Pagination
    activePage={props.activePage}
    totalPages={Math.ceil(props.totalVideos / props.pageLimit)}
    onPrev={props.onPrev}
    onNext={props.onNext}
    disabled={props.disabled}
  >
    <div
      style={{
        fontSize: '14px',
      }}
    >
      <Interpolate
        i18nKey="paginationDescription"
        totalVideos={props.totalVideos}
        startOffset={((props.activePage - 1) * props.pageLimit) + 1}
        endOffset={props.activePage * props.pageLimit > props.totalVideos
          ? props.totalVideos
          : props.activePage * props.pageLimit
        }
        activePage={props.activePage}
        total={totalPageNum(props.totalVideos, props.pageLimit)}
      />
    </div>
  </Pagination>
);

Paging.propTypes = {
  activePage: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  totalVideos: PropTypes.number.isRequired,
  pageLimit: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};


export default Paging;
