## Loading Bar
The LoadingBar component consists of its UI component, action and reducer for other modules to easily complete integrations.

## Props
| Name | Type | Default |
| ------ | ----------- | --- |
| showLoading | `bool` | `false` |
| loadingMessage | `string` | `'Loading...'` |

## Usage
Illustrate how to add a whole site loading bar in the application.
### Add Reducer
---
Find the app reducer file and add loading bar reducer.
```javascript
// This is a app reducer.js
import { combineReducers } from 'redux';
import { loadingBarReducer } from 'vidya/LoadingBar';
import auth from './auth'; // custom auth module
import { LOADING_BAR_REDUCER_NAME } from '../constants';

const createReducer = () => (
    combineReducers({
        // app reducers
        [LOADING_BAR_REDUCER_NAME] : loadingBarReducer,
    })
);
```

### Mount Loading Bar
---
Build a LoadingBarContainer.js and mount it in your App.js.

```javascript
// file name : LoadingBarContainer.js
import React from 'react';
import { connect } from 'react-redux';
import { LoadingBar } from 'vidya/LoadingBar'; // import the loading bar from core module
import { LOADING_BAR_REDUCER_NAME } from '../constants';

const mapStateToProps = (state) => (
  {
    showLoading : state[LOADING_BAR_REDUCER_NAME].loadingBar,
    loadingMessage : state[LOADING_BAR_REDUCER_NAME].loadingMessage,
  }
);

export default connect(mapStateToProps)(LoadingBar);
```

```javascript
// App.js
import LoadingBarContainer from '../LoadingBarContainer';
const App = (props) => (
    <div>
        <LoadingBarContainer />
        {props.children}
    </div>
);
```

### Passively dispatch Show / Hide loading in modules
---
```javascript
import { showLoading , hideLoading } from 'vidya/LoadingBar';

dispatch(showLoading(message));
dispatch(hideLoading());
```

