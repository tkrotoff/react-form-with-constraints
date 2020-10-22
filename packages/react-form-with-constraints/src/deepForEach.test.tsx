import * as React from 'react';

import { deepForEach } from '.';

test('deepForEach', () => {
  const component = (
    <div id="1">
      <div id="1.1">
        <div key="1.1.1" id="1.1.1" />
        <div key="1.1.2" id="1.1.2" />
        <div key="1.1.3" id="1.1.3" />
      </div>
      <div id="1.2">
        <div key="1.2.1" id="1.2.1" />
        <div key="1.2.2" id="1.2.2" />
        <div key="1.2.3" id="1.2.3" />
      </div>
      <div id="1.3">
        <div key="1.3.1" id="1.3.1" />
        <div key="1.3.2" id="1.3.2" />
        <div key="1.3.3" id="1.3.3" />
      </div>
    </div>
  );

  const children = new Array<React.ReactElement<any>>();

  deepForEach(component.props.children, child => {
    children.push(child);
  });

  expect(children).toEqual([
    <div key="1.1.1" id="1.1.1" />,
    <div key="1.1.2" id="1.1.2" />,
    <div key="1.1.3" id="1.1.3" />,
    // eslint-disable-next-line react/jsx-key
    <div id="1.1">
      <div key="1.1.1" id="1.1.1" />
      <div key="1.1.2" id="1.1.2" />
      <div key="1.1.3" id="1.1.3" />
    </div>,
    <div key="1.2.1" id="1.2.1" />,
    <div key="1.2.2" id="1.2.2" />,
    <div key="1.2.3" id="1.2.3" />,
    // eslint-disable-next-line react/jsx-key
    <div id="1.2">
      <div key="1.2.1" id="1.2.1" />
      <div key="1.2.2" id="1.2.2" />
      <div key="1.2.3" id="1.2.3" />
    </div>,
    <div key="1.3.1" id="1.3.1" />,
    <div key="1.3.2" id="1.3.2" />,
    <div key="1.3.3" id="1.3.3" />,
    // eslint-disable-next-line react/jsx-key
    <div id="1.3">
      <div key="1.3.1" id="1.3.1" />
      <div key="1.3.2" id="1.3.2" />
      <div key="1.3.3" id="1.3.3" />
    </div>
  ]);
});
