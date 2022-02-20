# Modal

## Props
| Name | Type | Default |
| ------ | ----------- | --- |
| headerHide | {'True','False'} | false |
| hideWhenBackground | {'True','False'} | false |
 
if set in Modal tag
> 'headerHide' hide header of Modal

> 'hideWhenBackground' hide modal if click background


## Instance Function (get them by `ref`)
### toHide()
hide the Modal

### toShow()
make the Modal Appear

### toClear()
set content inside Modal to null

### switchContent(reactComponent)
switch the content inside the Modal

## Example
```js
import { Modal } from '../../Dialogs';

<div>
  <button
    onClick={
      () => {
        this.modal.switchContent(<div>ContentA</div>);
        this.modal.toShow();
      }
    }
  >
    ContentA
  </button>
  <button
    onClick={
      () => {
        this.modal.switchContent(<div>ContentB</div>);
        this.modal.toShow();
      }
    }
  >
    ContentB
  </button>
  <Modal ref={(node) => { this.modal = node; }} headerHide hideWhenBackground />
  // caution! use react class to you can get the ref
</div>
```
