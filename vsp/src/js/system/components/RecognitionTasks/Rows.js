import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './style.scss';

class Rows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
      model_id_Icon: '',
    };
  }

  componentWillMount() {
    switch (this.props.model_id) {
      case 1:
        this.setState({ model_id_Icon: 'F' });
        break;
      case 2:
        this.setState({ model_id_Icon: 'I' });
        break;
      case 3:
        this.setState({ model_id_Icon: 'T' });
        break;
      case 4:
        this.setState({ model_id_Icon: 'A' });
        break;
      case 5:
        this.setState({ model_id_Icon: 'M' });
        break;
      case 6:
        this.setState({ model_id_Icon: 'O' });
        break;
      case 7:
        this.setState({ model_id_Icon: 'S' });
        break;
      default:
        break;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({
        checked: nextProps.checked,
      });
    }
  }
  handleInputChange= () => {
    this.setState({ checked: !this.state.checked });
    this.props.selectModel_job_id(this.props.model_job_id);
  }

  render() {
    return (
      <tr styleName={this.state.checked === true ? 'onActive' : ''}>
        <td styleName="center">
          <input type="checkbox" name="" checked={this.state.checked} onChange={this.handleInputChange} />
        </td>
        <td>{this.props.priority}</td>
        <td>{this.props.series_name}</td>
        <td>{this.props.video_name}</td>
        <td><div styleName="model_id_Icon">{this.state.model_id_Icon}</div></td>
        <td>{this.props.group_name}</td>
        <td>{this.props.account}</td>
        <td>{this.props.enqueue_time}</td>
      </tr>
    );
  }
}

Rows.propTypes = {
  checked: PropTypes.bool,
  series_name: PropTypes.string,
  video_name: PropTypes.string,
  group_name: PropTypes.string,
  account: PropTypes.string,
  priority: PropTypes.number,
  enqueue_time: PropTypes.string,
  selectModel_job_id: PropTypes.func,
  model_job_id: PropTypes.number,
  model_id: PropTypes.number,
};

export default CSSModules(Rows, style);
