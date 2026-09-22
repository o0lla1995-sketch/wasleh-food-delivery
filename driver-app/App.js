import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation";
import { ErrorBoundary } from "./src/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Navigation />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ErrorBoundary>
  );
}
