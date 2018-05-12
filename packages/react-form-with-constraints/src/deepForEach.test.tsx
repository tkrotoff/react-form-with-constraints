import React from 'react';

import { deepForEach } from './index';

test('deepForEach', () => {
  const component = (
    <div id="1">
      <div id="1.1">
        <div id="1.1.1" />
        <div id="1.1.2" />
        <div id="1.1.3" />
      </div>
      <div id="1.2">
        <div id="1.2.1" />
        <div id="1.2.2" />
        <div id="1.2.3" />
      </div>
      <div id="1.3">
        <div id="1.3.1" />
        <div id="1.3.2" />
        <div id="1.3.3" />
      </div>
    </div>
  );

  const children = new Array<React.ReactElement<any>>();

  deepForEach(component.props.children, child => {
    children.push(child);
  });

  // tslint:disable:jsx-key
  expect(children).toEqual([
    <div id="1.1.1" />,
    <div id="1.1.2" />,
    <div id="1.1.3" />,
    <div id="1.1"><div id="1.1.1" /><div id="1.1.2" /><div id="1.1.3" /></div>,
    <div id="1.2.1" />,
    <div id="1.2.2" />,
    <div id="1.2.3" />,
    <div id="1.2"><div id="1.2.1" /><div id="1.2.2" /><div id="1.2.3" /></div>,
    <div id="1.3.1" />,
    <div id="1.3.2" />,
    <div id="1.3.3" />,
    <div id="1.3"><div id="1.3.1" /><div id="1.3.2" /><div id="1.3.3" /></div>
  ]);
});
