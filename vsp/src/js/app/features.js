import admin from '../admin';
import auth from '../auth';
import cms from '../cms';
import core from '../core';
import hrs from '../hrs';
import report from '../report';
import rims from '../rims';
import system from '../system';
import tag2ad from '../tag2ad';

export default core.constants.DEBUG
  ? [
    admin,
    auth,
    cms,
    core,
    hrs,
    report,
    rims,
    system,
    tag2ad,
  ]
  : [
    admin,
    auth,
    cms,
    hrs,
    report,
    rims,
    system,
    tag2ad,
  ];
