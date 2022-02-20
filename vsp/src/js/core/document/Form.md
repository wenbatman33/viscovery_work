# Form

## Text Input
### Props
| Name | Type | Default |
| ------ | ----------- | --- |
| onChange | Function |  |
| onKeyPress | Function |  |
| value | {String, Number} | '' |
| defaultValue | {String, Number} |  |
| placeholder | {String, Number} |  |
| id | {String, Number} | '' |
| invalid | Boolean | `false`  |
| invalidMessage | String | 'invalid!' |
| gray | Boolean | `false`  |
| readOnly | Boolean | `false`  |
| password | Boolean | `false`  |

if TextInput is beside a <label>, 'id' should be the same with property 'forHtml' of <label>

### Example
```js
import { TextInput } from 'vidya/Form';

<label forHtml="seriesInput"></label>
<TextInput
  id="seriesInput"
  placeholder="輸入集數"
  value={this.state.series}
  onChange={this.handelSeries}
  invalid
  invalidMessage="請輸入整數"
/>

<TextInput
  placeholder="輸入集數"
  value={this.state.series}
  onChange={this.handelSeries}
  invalid
  invalidMessage="請輸入整數"
  gray
/>
```

## Switch
### Props
| Name | Type | Default |
| ------ | ----------- | --- |
| onChange | Function |  |
| checked | Boolean | `true` |

### Example
```js
import { Switch } from 'vidya/Form';

<Switch
  checked={this.state.switch}
  onChange={this.handleSwitch}
/>
```

## Dropdown List
### Props
| Name | Type | Default |
| ------ | ----------- | --- |
| onChange | Function |  |
| value | {String, Number, Array} |  |
| placeholder | String | `'------------'` |
| options | ArrayOf(Object) | [{label: '', value: 0,}] |
| gray | Boolean | `false` |


### Example
```js
import { DropdownList } from 'vidya/Form';

<DropdownList
  options={options}
  placeholder="選擇類別"
  onChange={this.handleValue}
  value={this.state.value}
/>

// grayscale
<DropdownList
  options={options}
  placeholder="選擇類別"
  onChange={this.handleValue}
  value={this.state.value}
  gray
/>
```

## Multi-level Dropdown List
### Props
| Name | Type | Default |
| ------ | ----------- | --- |
| onChange | Function |  |
| selected | Object | {label: '', value: 0} |
| options | ArrayOf(Object) | [{label: '', value: 0,}] |
| placeholder | String | '------------' |


### Example
```js
import { MultiLevelDL } from 'vidya/Form';

<MultiLevelDL
  options={options}
  onChange={this.handleValue}
  selected={this.state.selected}
/>
```

## Checkbox
### Props
| Name | Type | Default | Required |Return |
| ------ | ----------- | --- |--- | ---|
| value | {String , Number} |  |  | |
| checked | `Boolean` |  | `v` | |
| onChange | `Function` |  |  `v` | { `isChecked`, `value` } |
| disabled | `Boolean` | `False` | |  |
| style | `Object` | `{}` | |  |
| id | {String , Number} |  |  | |

if Checkbox is beside a <label>, 'id' should be the same with property 'forHtml' of <label>

### Example
```js
import { Checkbox } from 'vidya/Form';

  handleCheckboxChange = (checked, value) => {
    // do whatever you want
  };
  <label forHtml="checkBoxA"></label>
  <Checkbox
    id="checkBoxA"
    checked={ true }
    disabled={disableCheckbox}
    onChange={ this.handleCheckboxChange }
  />

```