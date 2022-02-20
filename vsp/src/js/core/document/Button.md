# Button

## Props
| Name | Type | Default |
| ------ | ----------- | --- |
| onClick | Function | |
| vdSize | {`'function'`,`'normal'`, `'big'`,`'icon'`,`'label'`} | `normal` |
| vdStyle | {`'primary'`,`'secondary'`,`'link'`} | `primary` |
| disable | Boolean | `false` |
| throttle | Number |  |

throttle is the millisecond to lock button after click if set.

## Example
```js
import { Button } from 'vidya/Button';

Clicked = (event) => {
  //use the click event,
  // if throttle set, will trigger this callback with the millisecon delay
}

<Button
  vdStyle={'primary'}
  vdSize={'big'}
  disable
  onCLick={this.Clicked}
>
```

# ButtonGroup

## Props
| Name | Type | Default |
| ------ | ----------- | --- |
| onChange | Function | |
| options | Array of objects {value: {Number, String}, label: {Number, String}} | [ {label: '', value: 0,}] |
| gray | `bool` | `false` |
| value | {Number, String} |  |

## Example
```js
import { ButtonGroup } from 'vidya/Button';

const fakeOption = [
  {
    value: 0,
    label: 'John Lennon',
    optional: 'addon1',
  },
  {
    value: 1,
    label: 'Paul McCartney',
  },
  {
    value: 2,
    label: 'George Harrison',
  },
  {
    value: 3,
    label: 'Ringo Starr',
  },
];

handleValue = (option) => {
  //use the return option...
  //(above example: { value: 0, label: 'John Lennon', optional: 'addon1' })
}

<ButtonGroup
  onChange={this.handleValue}
  value={this.state.value}
  options={fakeOption}
/>
```

# ButtonGroupElement

## Props
| Name | Type | Default |
| ------ | ----------- | --- |
| onChange | Function | |
| id | {Number, String}  | |
| name | {Number, String}  | |
| label | {Number, String} | |
| gray | `bool` | `false` |
| checked | `bool` |  |

usually ButtonGroupElement be used in component 'ButtonGroup',
not import in general components.

