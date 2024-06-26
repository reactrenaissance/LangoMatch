import React from "react";
import Home from "./src";
import { GluestackUIProvider } from "@gluestack-ui/themed-native-base";
import config from "theme";
import { QueryClient, QueryClientProvider } from "react-query";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={config}>
        <Home />
        <Toast />
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
