# Pagination

## Pagination

## Props
| Name | Type | Default | Required |
| ------ | ----------- | --- | ---|
| total | `Number` | 1 | `v` |
| prev | `bool` | `true` | |
| next | `bool` | `true` | |
| activePage | `Number` | 1 | `v` |
| visiblePages | `Number` | 10 | |
| onSelect | `Function` |  | |

### Example
```js
import Pagination from 'vidya/Pagination';

<Pagination
  total={10}
  activePage={3}
  visiblePages={5}
/>
```
