import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from "aws-amplify"
import outputs from "../amplify_outputs.json"


Amplify.configure(outputs);

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
     <RouterProvider router={router} />
    </Authenticator>
  </React.StrictMode>
)
