import React from 'react';
import { Platform, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
}

// See [React Native - how to set fixed width to individual characters (number, letter, etc)](https://stackoverflow.com/q/38933459)
export default function TextFixedWidth({ children }: Props) {
  const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';

  return <Text style={{ fontFamily }}>{children}</Text>;
}
