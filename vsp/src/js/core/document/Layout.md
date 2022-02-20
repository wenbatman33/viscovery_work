# GridView

## Props
| Name | Type | Default | Required | 
| ----- | ---------- | --- | --- | 
| elements | array of React Element | | `v` |
| column | {` 3 , 4, 5 `} | `3` | `v` |

## Example
```js
import { GridView } from 'vidya';

const Element = ({title, text}) => (
    <div>
        <h3>{title}</h3>
        <div>{text}</div>
    </div>
);

const mockData = [
    <Element title="Movie" text="Dr. Strange"/>,
    <Element title="Book" text="Harry Potter"/>,
    <Element title="Sport" text="basketball"/>,
    <Element title="National Park" text="Taroko Gorge"/>,
];

<GridView 
    elements={mockData} 
    column={3} 
>

```

## Insight
The full width of page will be equally distributed to each column.
The spacing between columns is of 1% of the page width.
For example, the width of a column in a 3-column grid view will be 32.6% of the page. 

# ListView

## Props
| Name | Type | Default | Required | 
| ----- | ---------- | --- | --- | 
| elements | array of React Element | | `v` |
| divider | Boolean |  | |

```js
import { ListView } from 'vidya';

const Element = ({title, text}) => (
    <div>
        <h3>{title}</h3>
        <div>{text}</div>
    </div>
);

const mockData = [
    <Element title="Movie" text="Dr. Strange"/>,
    <Element title="Book" text="Harry Potter"/>,
    <Element title="Sport" text="basketball"/>,
    <Element title="National Park" text="Taroko Gorge"/>,
];

<ListView 
    elements={mockData} 
    divider 
>
```