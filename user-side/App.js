import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import { store } from "./store.js";
import { Provider } from "react-redux";
import { AuthContextProvder } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <AuthContextProvder>
          <Provider store={store}>
            <RootNavigator />
          </Provider>
        </AuthContextProvder>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
