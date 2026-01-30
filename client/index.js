import { registerRootComponent, AppRegistry } from "expo";
import { Platform } from "react-native";

import App from "@/App";

registerRootComponent(App);

if (Platform.OS === "android") {
  import("@/androidAuto").then(({ registerAndroidAuto }) => {
    registerAndroidAuto();
  });
}
