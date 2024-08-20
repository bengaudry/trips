import Spinner, {
  type SpinnerPropTypes,
} from "react-native-loading-spinner-overlay";

export function LoadingOverlay({
  cancelable,
  overlayColor,
  visible,
  animation,
  hideSpinner,
  ...props
}: SpinnerPropTypes & { visible: boolean; hideSpinner?: boolean }) {
  return (
    <Spinner
      animation={animation ?? "none"}
      cancelable={cancelable ?? false}
      overlayColor={overlayColor ?? "#00000080"}
      visible={visible}
      size={hideSpinner ? 0 : "large"}
      {...props}
    />
  );
}
