import { StyleSheet } from 'react-native';
import { useFontSize } from '../contexts/FontSizeContext';

export function useDynamicStyles(baseStyles) {
  const { fontScale } = useFontSize();

  const scaledStyles = {};
  for (const key in baseStyles) {
    const style = baseStyles[key];
    if (style && style.fontSize) {
      scaledStyles[key] = {
        ...style,
        fontSize: style.fontSize * fontScale,
      };
    } else {
      scaledStyles[key] = style;
    }
  }

  return StyleSheet.create(scaledStyles);
} 