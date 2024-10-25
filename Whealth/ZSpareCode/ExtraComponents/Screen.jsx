import { useScrollToTop } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import React, { useRef, useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native"
import { colors } from "../theme/colors"
import { useSafeAreaInsetsStyle } from "../../app/util/useSafeAreaInsetsStyle"

const isIos = Platform.OS === "ios"

function isNonScrolling(preset) {
  return !preset || preset === "fixed"
}

function useAutoPreset(props) {
  const { preset, scrollEnabledToggleThreshold } = props
  const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {}

  const scrollViewHeight = useRef(null)
  const scrollViewContentHeight = useRef(null)
  const [scrollEnabled, setScrollEnabled] = useState(true)

  function updateScrollState() {
    if (scrollViewHeight.current === null || scrollViewContentHeight.current === null) return

    const contentFitsScreen = (function () {
      if (point) {
        return scrollViewContentHeight.current < scrollViewHeight.current - point
      } else {
        return scrollViewContentHeight.current < scrollViewHeight.current * percent
      }
    })()

    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false)
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true)
  }

  function onContentSizeChange(w, h) {
    scrollViewContentHeight.current = h
    updateScrollState()
  }

  function onLayout(e) {
    const { height } = e.nativeEvent.layout
    scrollViewHeight.current = height
    updateScrollState()
  }

  if (preset === "auto") updateScrollState()

  return {
    scrollEnabled: preset === "auto" ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  }
}

function ScreenWithoutScrolling(props) {
  const { style, contentContainerStyle, children } = props
  return (
    <View style={[$outerStyle, style]}>
      <View style={[$innerStyle, contentContainerStyle]}>{children}</View>
    </View>
  )
}

function ScreenWithScrolling(props) {
  const {
    children,
    keyboardShouldPersistTaps = "handled",
    contentContainerStyle,
    ScrollViewProps,
    style,
  } = props

  const ref = useRef(null)

  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(props)

  useScrollToTop(ref)

  return (
    <ScrollView
      {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
      {...ScrollViewProps}
      onLayout={(e) => {
        onLayout(e)
        ScrollViewProps?.onLayout?.(e)
      }}
      onContentSizeChange={(w, h) => {
        onContentSizeChange(w, h)
        ScrollViewProps?.onContentSizeChange?.(w, h)
      }}
      style={[$outerStyle, ScrollViewProps?.style, style]}
      contentContainerStyle={[
        $innerStyle,
        ScrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  )
}

export function Screen(props) {
  const {
    backgroundColor = colors.background,
    KeyboardAvoidingViewProps,
    keyboardOffset = 0,
    safeAreaEdges,
    StatusBarProps,
    statusBarStyle = "dark",
  } = props

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)

  return (
    <View style={[$containerStyle, { backgroundColor }, $containerInsets]}>
      <StatusBar style={statusBarStyle} {...StatusBarProps} />

      <KeyboardAvoidingView
        behavior={isIos ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
        {...KeyboardAvoidingViewProps}
        style={[$keyboardAvoidingViewStyle, KeyboardAvoidingViewProps?.style]}
      >
        {isNonScrolling(props.preset) ? (
          <ScreenWithoutScrolling {...props} />
        ) : (
          <ScreenWithScrolling {...props} />
        )}
      </KeyboardAvoidingView>
    </View>
  )
}

const $containerStyle = {
  flex: 1,
  height: "100%",
  width: "100%",
}

const $keyboardAvoidingViewStyle = {
  flex: 1,
}

const $outerStyle = {
  flex: 1,
  height: "100%",
  width: "100%",
}

const $innerStyle = {
  justifyContent: "flex-start",
  alignItems: "stretch",
}