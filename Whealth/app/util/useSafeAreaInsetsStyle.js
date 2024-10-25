import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, Platform } from 'react-native';

const propertySuffixMap = {
  top: "Top",
  bottom: "Bottom",
  left: "Start",
  right: "End",
  start: "Start",
  end: "End",
};

const edgeInsetMap = {
  start: "left",
  end: "right",
};

/**
 * A hook that can be used to create a safe-area-aware style object that can be passed directly to a View.
 * @param {Array} safeAreaEdges - The edges to apply the safe area insets to.
 * @param {"padding" | "margin"} property - The property to apply the safe area insets to.
 * @param {Object} additionalInsets - Additional insets to add to each edge (as a percentage of screen height/width).
 *                                    Can be a number or an object with 'ios' and 'android' keys.
 * @returns {Object} - The style object with the safe area insets applied.
 */
export function useSafeAreaInsetsStyle(
  safeAreaEdges = [],
  property = "padding",
  additionalInsets = {}
) {
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');

  return safeAreaEdges.reduce((acc, e) => {
    const value = edgeInsetMap[e] ?? e;
    let insetValue = insets[value] || 0; // Fallback to 0 if inset is undefined

    // Add additional inset if specified
    if (additionalInsets[e] !== undefined) {
      let additionalInset = additionalInsets[e];
      
      // Check if the additional inset is platform-specific
      if (typeof additionalInset === 'object' && (additionalInset.ios !== undefined || additionalInset.android !== undefined)) {
        additionalInset = Platform.select(additionalInset) ?? 0;
      }

      // Ensure additionalInset is a number
      additionalInset = Number(additionalInset);

      if (!isNaN(additionalInset)) {
        const additionalPixels = (e === 'left' || e === 'right' || e === 'start' || e === 'end')
          ? width * (additionalInset / 100)
          : height * (additionalInset / 100);
        insetValue += additionalPixels;
      }
    }

    // Ensure the final value is not NaN
    insetValue = isNaN(insetValue) ? 0 : insetValue;

    return { ...acc, [`${property}${propertySuffixMap[e]}`]: insetValue };
  }, {});
}