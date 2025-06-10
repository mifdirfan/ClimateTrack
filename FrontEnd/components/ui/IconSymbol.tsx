// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Foundation } from '@expo/vector-icons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconFamily = 'MaterialIcons' | 'Foundation';
type IconMapping = Record<
    SymbolViewProps['name'],
    { name: string; family: IconFamily }
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': { name: 'home', family: 'MaterialIcons' },
  'paperplane.fill': { name: 'send', family: 'MaterialIcons' },
  'newspaper.fill': { name: 'article', family: 'MaterialIcons' },
  'chevron.left.forwardslash.chevron.right': { name: 'code', family: 'MaterialIcons' },
  'chevron.right': { name: 'chevron-right', family: 'MaterialIcons' },
  'map.fill': { name: 'map', family: 'Foundation' },  // Foundation icon here
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const icon = MAPPING[name];

  if (icon.family === 'Foundation') {
    return <Foundation name={icon.name} size={size} color={color} style={style} />;
  }

  // Default to MaterialIcons
  return <MaterialIcons name={icon.name} size={size} color={color} style={style} />;
}
