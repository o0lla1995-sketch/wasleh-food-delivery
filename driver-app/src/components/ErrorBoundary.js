import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log("App crashed:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: "#FFF5F0", padding: 20, justifyContent: "center" }}>
          <ScrollView>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#FF6B35", marginBottom: 16 }}>
              Wasleh encountered an error
            </Text>
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
              The app hit an unexpected error. You can try to continue, or
              close and reopen the app.
            </Text>
            <Text style={{ fontSize: 12, color: "#888", marginBottom: 8, fontWeight: "bold" }}>
              Error details:
            </Text>
            <Text style={{ fontSize: 11, color: "#999", fontFamily: "monospace", marginBottom: 16 }}>
              {this.state.error?.toString()}
            </Text>
            {this.state.errorInfo?.componentStack && (
              <Text style={{ fontSize: 10, color: "#aaa", fontFamily: "monospace", marginBottom: 24 }}>
                {this.state.errorInfo.componentStack.substring(0, 1500)}
              </Text>
            )}
            <TouchableOpacity
              onPress={this.handleReload}
              style={{ backgroundColor: "#FF6B35", padding: 14, borderRadius: 12, alignItems: "center" }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Try again
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}
