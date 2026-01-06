// "use client";

// import { Provider } from "react-redux";
// import { store } from "../app/store/store"; // <-- adjust the import path

// export default function ReduxProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <Provider store={store}>{children}</Provider>;
// }
"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "../app/store/store";
import { ToastProvider } from "../app/component/ui/use-toast";

interface AppProvidersProps {
  children: React.ReactNode;
}

// Wraps the app with Redux and Toast providers
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </ReduxProvider>
  );
}
