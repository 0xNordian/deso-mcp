import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../src/lib/graphql/client'
import { initialize, mswLoader } from 'msw-storybook-addon'
import '../src/app/globals.css'

// Initialize MSW
initialize({
  onUnhandledRequest: (request) => {
    // Silently bypass all non-GraphQL requests.
    if (request.url.includes('/graphql')) {
      // If it's a GraphQL request but we haven't handled it, print a warning.
      console.warn(`[MSW] Unhandled GraphQL request: ${request.method} ${request.url}`);
    }
    // For all other requests, do nothing, effectively bypassing them.
  },
});

const preview: Preview = {
  parameters: {
    docs: {
      toc: true,
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
  },
  loaders: [mswLoader], // Add MSW loader globally
  decorators: [
    (Story) => (
        <ApolloProvider client={apolloClient}>
          <div className="p-4">
            <Story />
          </div>
        </ApolloProvider>
    ),
  ],
};

export default preview;