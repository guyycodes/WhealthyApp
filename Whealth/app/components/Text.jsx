import React, { useMemo }  from "react"
import { Text as RNText } from "react-native"
import { isRTL, translate, isValidKeyPath } from "app/i18n"
import { colors} from "app/theme/colors"
import { typography } from "app/theme/typography"

const $sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 },
  xl: { fontSize: 24, lineHeight: 34 },
  lg: { fontSize: 20, lineHeight: 32 },
  md: { fontSize: 18, lineHeight: 26 },
  sm: { fontSize: 16, lineHeight: 24 },
  xs: { fontSize: 14, lineHeight: 21 },
  xxs: { fontSize: 12, lineHeight: 18 },
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {})

const $baseStyle = [
  $sizeStyles.sm,
  $fontWeightStyles.normal,
  { color: colors.text },
]

const $presets = {
  default: $baseStyle,
  bold: [$baseStyle, $fontWeightStyles.bold],
  heading: [$baseStyle, $sizeStyles.xxl, $fontWeightStyles.bold],
  subheading: [$baseStyle, $sizeStyles.lg, $fontWeightStyles.medium],
  formLabel: [$baseStyle, $fontWeightStyles.medium],
  formHelper: [$baseStyle, $sizeStyles.sm, $fontWeightStyles.normal],
}

const $rtlStyle = isRTL ? { writingDirection: "rtl" } : {}

const TextComponent = (props) => {
  const { weight, size, tx, txOptions, text, children, style: $styleOverride, ...rest } = props;

  const i18nText = tx && isValidKeyPath(tx) ? translate(tx, txOptions) : undefined;
  const content = i18nText || text || children;

  if (process.env.NODE_ENV === 'development' && tx && !isValidKeyPath(tx)) {
    console.warn(`Translation key "${tx}" does not exist`)
  }


  const preset = props.preset ?? "default"
  const $styles = [
    $rtlStyle,
    $presets[preset],
    weight && $fontWeightStyles[weight],
    size && $sizeStyles[size],
    $styleOverride,
  ]

  return (
    <RNText {...rest} style={$styles}>
      {content}
    </RNText>
  )
}
export const Text = React.memo(TextComponent);