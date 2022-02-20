import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';

import { DropdownList } from 'vidya/Form';
import { Button } from 'vidya/Button';

import { sortByKey } from '../utils';
import DateRangePicker from '../common/DateRangePicker';
import VideoReportTable from './VideoReportTable';

import styles from './PersonalReport.scss';

const defaultZero = R.defaultTo(0);

const reduceByBrand = R.compose(
  R.map(ele => R.reduce(
    (pV, cV) => ({
      brand_name: cV.brand_name,
      brand_id: cV.brand_id,
      model_id: cV.model_id,
      confirm: defaultZero(cV.confirm) + defaultZero(pV.confirm),
      count: defaultZero(cV.count) + defaultZero(pV.count),
      delete: defaultZero(cV.delete) + defaultZero(pV.delete),
      label: defaultZero(cV.label) + defaultZero(pV.label),
      modify: defaultZero(cV.modify) + defaultZero(pV.modify),
      sum_of_time_duration:
      defaultZero(cV.sum_of_time_duration) + defaultZero(pV.sum_of_time_duration),
    }),
    {},
    ele[1],
  )),
  R.toPairs,
  R.groupBy(R.prop('brand_id')),
);

const groupByVideo = R.compose(
  R.map(ele => ({
    id: ele[0],
    name: ele[1][0].video_name,
    data: reduceByBrand(ele[1]),
  })),
  R.toPairs,
  R.groupBy(R.prop('video_id')),
  R.map(ele => R.omit(['report_time', 'model_job_id', 'class_id', 'user_name'])(ele)),
);

const getAssigneeData = currentAssignee => R.compose(
  groupByVideo,
  R.propOr([], currentAssignee),
  R.groupBy(R.prop('assignee_id')),
);

const getAssigneesList = R.compose(
  R.map(ele => ({
    value: ele.uid,
    label: ele.account,
  })),
);

const mappingLang = (lang) => {
  const mapping = {
    enus: 'en-US',
    zhtw: 'zh-TW',
    zhcn: 'zh-CN',
  };
  return mapping[lang] || lang;
};

class PersonalReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      assignee: null,
      showAllTable: false,
    };

    this.handleAssignee = this.handleAssignee.bind(this);
  }

  componentWillMount() {
    const {
      assigneeId,
    } = this.props.match.params;
    const cacheAssignee = this.props.cache.userId || null;
    if (assigneeId) {
      this.setState({
        assignee: Number(assigneeId),
      });
      this.props.setReportPersonalCache(Number(assigneeId));
    } else if (cacheAssignee) {
      this.setState({
        assignee: Number(cacheAssignee),
      });
    }
  }

  componentDidMount() {
    const {
      since,
      to,
    } = this.props.location.query;
    const { assigneeId } = this.props.match.params;
    const { lang } = this.props;

    if (since && to && !!assigneeId) {
      this.props.getReports(since, to, mappingLang(lang), assigneeId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      since,
      to,
    } = this.props.location.query;

    const {
      since: nextSince,
      to: nextTo,
    } = nextProps.location.query;

    const { lang } = this.props;

    if (
      (since !== nextSince
      || to !== nextTo)
      && this.state.assignee !== null
    ) {
      this.props.getReports(nextSince, nextTo, mappingLang(lang), this.state.assignee);
    }

    if (!since || !to) {
      return;
    }
  }

  handleAssignee(assignee) {
    const { since, to } = this.props.location.query;
    const { lang } = this.props;
    const oldAssignee = this.state.assignee;
    if (oldAssignee !== assignee) {
      this.setState({
        assignee,
        showAllTable: false,
      });
      this.props.setReportPersonalCache(Number(assignee));
      if (!!since && !!to) {
        this.props.getReports(since, to, mappingLang(lang), assignee);
      }
    }
  }

  render() {
    const { reports, hrsMembers } = this.props;
    const filteredReports = R.filter(ele => ele.count > 0)(reports);
    const { assignee } = this.state;
    const assigneeOptions = getAssigneesList(hrsMembers).sort(sortByKey('label'));
    const assignees = R.map(ele => ele.value)(assigneeOptions);

    let currentAssignee = null;
    if (R.indexOf(assignee)(assignees) > -1) {
      currentAssignee = assignee;
    }

    const currentAssigneeData = getAssigneeData(currentAssignee)(filteredReports);
    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            height: '60px',
            padding: '0 69px',
          }}
        >
          <div
            style={{
              width: '200px',
              marginRight: '30px',
            }}
          >
            <DropdownList
              options={assigneeOptions}
              value={currentAssignee}
              onChange={({ value }) => {
                this.handleAssignee(value);
              }}
              placeholder="使用者帳號"
            />
          </div>
          <DateRangePicker
            since={this.props.location.query.since}
            to={this.props.location.query.to}
          />
        </div>
        <div styleName="container">
          { (currentAssigneeData && currentAssigneeData.length > 0)
            ? currentAssigneeData.map((ele, index) => {
              if (index < 20 || this.state.showAllTable) {
                return (
                  <VideoReportTable
                    key={ele.id}
                    videoName={ele.name}
                    brandReports={ele.data}
                  />);
              }
              return null;
            })
            : '無紀錄報表'
          }
          {
            (currentAssigneeData && currentAssigneeData.length > 20 && !this.state.showAllTable)
            ?
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60px',
                }}
              >
                <Button
                  vdSize="normal"
                  vdStyle="secondary"
                  onClick={() => {
                    this.setState({ showAllTable: true });
                  }}
                  style={{
                    marginRight: '8px',
                  }}
                >Show All</Button>
              </div>
            : null
          }
        </div>
      </div>
    );
  }
}

PersonalReport.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
  }),
  match: PropTypes.object,
  params: PropTypes.shape({
    assigneeId: PropTypes.string,
  }),
  getReports: PropTypes.func,
  reports: PropTypes.arrayOf(PropTypes.object),
  lang: PropTypes.string,
  hrsMembers: PropTypes.arrayOf(PropTypes.object),
  setReportPersonalCache: PropTypes.func,
  cache: PropTypes.shape({
    userId: PropTypes.number,
  }),
};

export default CSSModules(PersonalReport, styles);
