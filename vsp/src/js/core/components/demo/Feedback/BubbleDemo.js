import React from 'react';

import { Bubble } from 'vidya/Feedback';

const BubbleDemo = () => (
  <div
    style={{
      margin: '20px 0',
    }}
  >
    <strong>Bubble</strong>
    <Bubble>
      同一個軀殼裡，住著兩種情感的肉體，強與弱對峙，熱與冷相逼
      ，當有一方耗盡力氣時，另一方反撲回來接手殘局。
    </Bubble>
  </div>
);

export default BubbleDemo;
