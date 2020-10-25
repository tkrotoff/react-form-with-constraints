export enum Color {
  Red = 'Red',
  Orange = 'Orange',
  Yellow = 'Yellow',
  Green = 'Green',
  Blue = 'Blue',
  Indigo = 'Indigo',
  Violet = 'Violet'
}

export const colorKeys = Object.keys(Color) as (keyof typeof Color)[];
