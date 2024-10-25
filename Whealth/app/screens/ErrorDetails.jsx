import React from "react"
import { ScrollView, View } from "react-native"
import { Button } from "../components/Button"
import { Icon} from "app/components/Icon"
import { Screen } from "app/components/Screen"
import { Text } from "app/components/Text"
import { colors } from "app/theme/colors"
import { spacing } from "app/theme/spacing"


/**
 * Renders the error details screen.
 * @param {object} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props) {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$contentContainer}
    >
      <View style={$topSection}>
        <Icon icon="ladybug" size={64} />
        <Text style={$heading} preset="subheading" tx="errorScreen.title" />
        <Text tx="errorScreen.friendlySubtitle" />
      </View>

      <ScrollView style={$errorSection} contentContainerStyle={$errorSectionContentContainer}>
        <Text style={$errorContent} weight="bold" text={`${props.error}`.trim()} />
        <Text
          selectable
          style={$errorBacktrace}
          text={`${props.errorInfo?.componentStack ?? ""}`.trim()}
        />
      </ScrollView>

      <Button
        preset="reversed"
        style={$resetButton}
        onPress={props.onReset}
        tx="errorScreen.reset"
      />
    </Screen>
  )
}

const $contentContainer = {
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  flex: 1,
}

const $topSection = {
  flex: 1,
  alignItems: "center",
}

const $heading = {
  color: colors.error,
  marginBottom: spacing.md,
}

const $errorSection = {
  flex: 2,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
  borderRadius: 6,
}

const $errorSectionContentContainer = {
  padding: spacing.md,
}

const $errorContent = {
  color: colors.error,
}

const $errorBacktrace = {
  marginTop: spacing.md,
  color: colors.textDim,
}

const $resetButton = {
  backgroundColor: colors.error,
  paddingHorizontal: spacing.xxl,
}