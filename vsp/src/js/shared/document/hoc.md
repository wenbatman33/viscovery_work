# ApiConfigHOC
This HOC offers the wrapped component with the values of static resource hosts -- image resource host and video resource host.

## Props
| Name | Type | Default |
| ------ | ----------- | --- |
| imgHost | `string` | `null` |
| videoHost | `string` | `null` |

## Usage
It works with both React components and containers (yeah, fine with nested connect() redux HOC).
The only thing is that I suggests it goes after react-css-module HOC. 
Otherwise, it might break up css styles or gets uncaught TypeError.

```js
import React from 'react';
import CSSModules from 'react-css-modules';
import {
  ApiConfigHOC,
} from '../shared/hoc';

import styles from './styles.scss';

const TestComponent = () => (
  <div styleName="text">Test</div>
);


export default ApiConfigHOC(CSSModules(TestComponent, styles));
```
