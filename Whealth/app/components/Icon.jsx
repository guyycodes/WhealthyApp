import * as React from "react"
import {
  Image,
  TouchableOpacity,
  View,
} from "react-native"
import PropTypes from 'prop-types'

export function Icon(props) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  // Add this check
  if (!iconRegistry || !iconRegistry[icon]) {
    console.warn(`Icon "${icon}" not found in iconRegistry`);
    return null; // or return a default icon
  }

  const isPressable = !!WrapperProps.onPress
  const Wrapper = WrapperProps?.onPress ? TouchableOpacity : View

  const $imageStyle = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { width: size, height: size },
    $imageStyleOverride,
  ]

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </Wrapper>
  )
}

Icon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    (props, propName, componentName) => {
      if (!iconRegistry || !iconRegistry[props[propName]]) {
        return new Error(
          `Invalid prop '${propName}' supplied to '${componentName}'. Expected one of: ${Object.keys(iconRegistry || {}).join(', ')}`
        );
      }
    }
  ]),
  color: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
}

export const iconRegistry = {
  separator: require("../../assets/icons/lineSeparator.png"),
  notification: require("../../assets/icons/notification.png"),
  globe: require("../../assets/icons/global.png"),
  _logo: require("../../assets/icons/logo_3d.png"),
  logo: require("../../assets/icons/logo.png"),
  notificationBell: require("../../assets/icons/notification1.png"),
  updates: require("../../assets/icons/updates.png"),
  discounts: require("../../assets/icons/discounts.png"),
  bannerLogo: require("../../assets/icons/demo/bannerLogo.png"),
  homeIcon: require("../../assets/icons/home.png"),
  info: require("../../assets/icons/info.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  searchIcon: require("../../assets/icons/search.png"),
  favoriteIcon: require("../../assets/icons/favorite.png"),
  settings: require("../../assets/icons/settingsTop.png"),
  notification_true: require("../../assets/icons/notification_true.png"),
  notification_false: require("../../assets/icons/notification_false.png"),
  twentyFourSeven: require("../../assets/icons/24_7.png"),
  assurance: require("../../assets/icons/assurance.png"),
  health: require("../../assets/icons/health.png"),
  gift: require("../../assets/icons/gift.png"),
  article: require("../../assets/icons/articles.png"),
  ai: require("../../assets/icons/a.i.png"),
  visuals: require("../../assets/icons/visuals.png"),
  profile: require("../../assets/icons/profile.png"),
  // support: require("../../assets/icons/support.png"),
  // lease: require("../../assets/icons/lease.png"),
  // legal: require("../../assets/icons/legal.png"),
  // marketplaceIcon: require("../../assets/icons/marketplace.png"),
  // messageIcon: require("../../assets/icons/message.png"),
  // payIcon: require("../../assets/icons/pay.png"),
  // wallet: require("../../assets/icons/wallet.png"),
  // carIcon: require("../../assets/icons/car.png"),
  // self: require("../../assets/icons/self.png"),
  // stayInformed: require("../../assets/icons/stayInformed.png"),
  // clap: require("../../assets/icons/clap.png"),
  // heart: require("../../assets/icons/demo/heart.png"),
  // back: require("../../assets/icons/back.png"),
  // bell: require("../../assets/icons/bell.png"),
  // caretLeft: require("../../assets/icons/caretLeft.png"),
  // caretRight: require("../../assets/icons/caretRight.png"),
  // check: require("../../assets/icons/check.png"),
  // hidden: require("../../assets/icons/hidden.png"),
  // lock: require("../../assets/icons/lock.png"),
  // menu: require("../../assets/icons/menu.png"),
  // more: require("../../assets/icons/more.png"),
  // view: require("../../assets/icons/view.png"),
  // x: require("../../assets/icons/x.png"),
}

const $imageStyleBase = {
  resizeMode: "contain",
}