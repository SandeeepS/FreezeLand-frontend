import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./App/store.ts";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./components/Common/ErrorFallBack.tsx";
import { persistor } from './App/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <ErrorBoundary FallbackComponent={ErrorFallBack} onReset={() => {
          location.href='/'
        }}>
          <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
        </ErrorBoundary>
      </Provider>
    </StrictMode>
  </BrowserRouter>
);
