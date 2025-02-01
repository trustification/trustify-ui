import React from "react";

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ENV from "@app/env";
import App from "@app/App";
import "@app/dayjs";
import { OidcProvider } from "@app/components/OidcProvider";

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);

const renderApp = () => {
  return root.render(
    <React.StrictMode>
      <OidcProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </OidcProvider>
    </React.StrictMode>
  );
};

// if (ENV.NODE_ENV === "development") {
//   import("./mocks/browser").then((browserMocks) => {
//     if (browserMocks.config.enabled) {
//       browserMocks.worker.start();
//     }
//     renderApp();
//   });
// } else {
//   renderApp();
// }
renderApp();
