import React, { Component } from 'react';

export default class LoadingPage extends Component {
  render() {
    return (
      <div className="page404">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center">{'loading'}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
