import { Children } from 'react';

// Recursive React.Children.forEach()
// Taken from https://github.com/fernandopasik/react-children-utilities/blob/v0.2.2/src/index.js#L68
export function deepForEach(
  children: React.ReactNode,
  fn: (child: React.ReactElement<any>) => void
) {
  Children.forEach(children, child => {
    const element = child as React.ReactElement<any>;
    if (element.props && element.props.children && typeof element.props.children === 'object') {
      deepForEach(element.props.children, fn);
    }
    fn(element);
  });
}
