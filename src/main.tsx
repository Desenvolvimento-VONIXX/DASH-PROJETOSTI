
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner"

const hashHistory = createHashHistory();
 
const router = createRouter({ routeTree, history: hashHistory });
 
const queryClient = new QueryClient();
 
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
 
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster /> 

    </QueryClientProvider>
  </StrictMode>
);