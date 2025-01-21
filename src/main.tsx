import "./index.css";
import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";
import { Provider } from "react-redux";
import { StrictMode } from "react";
import Root from "./routes/root.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <Root />
      </StrictMode>
    </PersistGate>
  </Provider>
);
