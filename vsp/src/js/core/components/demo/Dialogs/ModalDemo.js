import React from 'react';

import {
  Button,
} from '../../Button';

import {
  Modal,
} from '../../Dialogs';

class ModalDemo extends React.Component {
  render() {
    const contentA = (
      <div>
        <h1>ContentA</h1>
        自我迷失於那無底的確定性，感覺從此是自己人生的局外人，但這樣的距離
        足定以擴大生命，擺脫仿佛情人般的如豆目光 — 在此存在某種解放的原則。
        這個嶄新的獨立性有時間限制，如同所有行動的自由。
        <div>
          <Button
            vdStyle="primary"
            vdSize="big"
            onClick={
              () => {
                this.modal.toHide();
              }
            }
          >
            關閉
          </Button>
        </div>
      </div>
    );

    const contentB = (
      <div>
        <h1>ContentB</h1>
        這段時間我想，你父親，巴蘇亞，或者是老鄒，都好像有什麼尖刺一樣的東西，
        留在他們身上。他們很努力地花了很長的時間一一把它們拔出來，可是可能剩下
        最後一根的時候，反而把它刺了進去。
        <div>
          <Button
            vdStyle="primary"
            vdSize="big"
            onClick={
              () => {
                this.modal.toHide();
              }
            }
          >
            關閉
          </Button>
        </div>
      </div>
    );
    return (
      <div>
        <strong>Modal</strong>
        <div>
          <Button
            vdStyle="secondary"
            vdSize="function"
            onClick={
              () => {
                this.modal.switchContent(contentA);
                this.modal.toShow();
              }
            }
          >
            ContentA
          </Button>
          <Button
            vdStyle="secondary"
            vdSize="function"
            onClick={
              () => {
                this.modal.switchContent(contentB);
                this.modal.toShow();
              }
            }
          >
            ContentB
          </Button>
          <Modal ref={(node) => { this.modal = node; }} />
        </div>
      </div>
    );
  }
}

export default ModalDemo;
