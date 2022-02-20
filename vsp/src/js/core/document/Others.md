# Other

## ImagePlaceholder

## Props
| Name | Type | Default |
| ------ | ----------- | --- |
| src | `String` | |
| alt | `String` | |

### Usage
* image placeholder like facebook content placeholder style
* image will fit your wrapper dom and be vertical and horizontal center

### Example
```js
import { ImagePlaceholder } from 'vidya/Others';

<div styleName="img">
  <ImagePlaceholder
    src="https://goo.gl/vHAcBK"
    alt="img"
  />
</div>
```

## Carousel

### guide
* direction, with or other styles of blocks inside Carousel must given by you

```js
import { Carousel } from 'vidya/Others';

const Block = () =>
  <div
   style={{
     display: 'inline-block',
     width: '50px',
     height: '50px',
     background: 'grey',
   }}
  />


<Carousel>
  {
    Array(20).fill(0).map((ele, index) =>
      <Block
        key={index}
      />
    )
  }
</Carousel>
```

## LazyloadImage

### usage
* load source when image is in the viewport

### Props
| Name | Type | Default |
| ------ | ----------- | --- |
| intervalTime(ms) | `Number` | 1000 |

```js
import { LazyloadImage } from 'vidya/Others';

<LazyloadImage
  src="https://example.com/example.jpg"
  intervalTime={800}
  alt="img"
/>
```
