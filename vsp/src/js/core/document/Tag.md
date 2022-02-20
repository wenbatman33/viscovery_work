# Tag

## Props
| Name | Type | Default | Required |
| ------ | ----------- | --- | --- |
| onDelete | Function | () => {} | |
| label | `String` | | `v` |
| value | {`String`,`Number`} | | |

## Example
```js
import { Tag } from 'vidya/Tag';

const removeTag = val => {
  //handle val
}

<Tag
  label={'labelText'}
  value={'labelValue'}
  onDelete={this.removeTag}
>
```
