/**
 * Copyright 2016-present, Viscovery Pte. Ltd.
 * All rights reserved.
 *
 * Author: Amdis Liu <amdis.liu@viscovery.co>
 * Contributor: Chia-Wei Li <dreamcwli@viscovery.co>
 * Description: An utility class for making request to API endpoints.
 */
import 'whatwg-fetch';
import R from 'ramda';
import LTracker from './LTracker';

const BASE_URL = process.env.VDS_HOST;

let _handler401;

const appendToken = (header) => {
  if (!ApiUtil.token) {
    return header;
  }

  return {
    ...header,
    Authorization: `Bearer ${ApiUtil.token}`,
  };
};

const appendVdsName = (header) => {
  if (!ApiUtil.account) {
    return header;
  }

  return {
    ...header,
    VdsUser: ApiUtil.account,
  };
};

const buildHeaders = header =>
  R.compose(
    appendVdsName,
    appendToken
  )(header);

function buildWrapper(method, path) {
  LTracker.send({
    category: 'api',
    level: 'info',
    method,
    path,
  });
  return (response) => {
    const wrappedResponse = response.clone();
    wrappedResponse.method = method;
    wrappedResponse.path = path;

    return wrappedResponse;
  };
}


function checkStatus(response) {
  if (response.ok) {
    return response;
  }

  if (!response.ok && response.status === 401) {
    if (_handler401) {
      _handler401();
    }
  }

  return response.json()
    .then((json) => {
      const error = new Error(response.statusText);
      error.response = response;
      error.json = json;
      LTracker.send({
        category: 'api',
        level: 'error',
        method: response.method,
        path: response.path,
        status: response.status,
        response: json || '',
      });
      return Promise.reject(error);
    });
}

function checkResponse(response) {
  if (response.status === 204) {
    return response;
  }
  return response.json()
    .then((json) => {
      if (json.response_code > 0) {
        return Promise.resolve(json);
      }
      const error = new Error(response.statusText);
      error.response = response;
      error.json = json;
      LTracker.send({
        category: 'api',
        level: 'warn',
        method: response.method,
        path: response.path,
        status: response.status,
        response: (json && json.message) || '',
      });
      return Promise.reject(error);
    });
}

class ApiUtil {
  static get(path) {
    const url = BASE_URL + path;
    const options = {
      method: 'GET',
      headers: buildHeaders({}),
    };
    const wrapper = buildWrapper('GET', path);
    return fetch(url, options)
      .then(wrapper)
      .then(checkStatus)
      .then(checkResponse);
  }
  static post(path, data, extraHeaders = {}) {
    const url = BASE_URL + path;
    const options = {
      method: 'POST',
      headers: buildHeaders(extraHeaders),
      body: data,
    };
    const wrapper = buildWrapper('POST', path);
    return fetch(url, options)
      .then(wrapper)
      .then(checkStatus)
      .then(checkResponse);
  }
  static patch(path, data, extraHeaders = {}) {
    const url = BASE_URL + path;
    const options = {
      method: 'PATCH',
      headers: buildHeaders(extraHeaders),
      body: data,
    };
    const wrapper = buildWrapper('PATCH', path);
    return fetch(url, options)
      .then(wrapper)
      .then(checkStatus)
      .then(checkResponse);
  }
  static put(path, data, extraHeaders = {}) {
    const url = BASE_URL + path;
    const options = {
      method: 'PUT',
      headers: buildHeaders(extraHeaders),
      body: data,
    };
    const wrapper = buildWrapper('PUT', path);
    return fetch(url, options)
      .then(wrapper)
      .then(checkStatus)
      .then(checkResponse);
  }
  static erase(path, data) {
    const url = BASE_URL + path;
    const options = {
      method: 'DELETE',
      headers: buildHeaders({}),
      body: data,
    };
    const wrapper = buildWrapper('DELETE', path);
    return fetch(url, options)
      .then(wrapper)
      .then(checkStatus)
      .then(checkResponse);
  }

  static reg401handler(cb) {
    if (cb && typeof cb === 'function') {
      _handler401 = cb;
    }
  }
}

ApiUtil.baseUrl = BASE_URL;

export default ApiUtil;
