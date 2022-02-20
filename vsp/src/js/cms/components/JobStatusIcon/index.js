import PropTypes from 'prop-types';
/**
* Created Date : 2016/11/23
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : Show recognition job status
*/
import React from 'react';
import CSSModules from 'react-css-modules';

import Waiting from './Waiting';
import Processing from './Processing';
import Success from './Success';
import Fail from './Fail';

import styles from './styles.scss';

class JobStatusIcon extends React.Component {
  static propTypes = {
    model: PropTypes.oneOf(['F', 'I', 'T', 'A', 'M', 'O', 'S']),
    status: PropTypes.oneOf(['waiting', 'processing', 'success', 'fail']).isRequired,
    message: PropTypes.string,
  };

  render() {
    const { model, status, message } = this.props;
    const content = ((s) => {
      switch (s) {
        case 'waiting':
          return <Waiting text={model} message={message} />;
        case 'processing':
          return <Processing text={model} message={message} />;
        case 'success':
          return <Success text={model} message={message} />;
        case 'fail':
        default :
          return <Fail text={model} message={message} />;
      }
    })(status);
    return (
      <div styleName="icon">
        {content}
      </div>
    );
  }
}

export default CSSModules(JobStatusIcon, styles);
