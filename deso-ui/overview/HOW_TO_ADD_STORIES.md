# How to Add and Mock Stories in the DeSo UI Library

This guide outlines the standardized process for creating stories for DeSo UI components, with a focus on our centralized data mocking strategy using Mock Service Worker (MSW). Following these steps ensures that our Storybook is consistent, maintainable, and easy to work with.

## Core Concepts

Our Storybook setup relies on a few key principles:

1.  **Component Isolation**: Stories should render a single component in various states to allow for isolated development and testing.
2.  **Centralized Mocking**: All API mocking logic is centralized to avoid duplication and keep stories clean. We use MSW to intercept GraphQL requests.
3.  **Single Source of Truth for Data**: All mock data (e.g., profile info, image URLs) is stored in `deso-ui/src/lib/mocks/deso-data.ts`.
4.  **GraphQL Operation-Based Handlers**: We use MSW's `graphql.query()` to mock responses based on the GraphQL operation name (e.g., `GetProfileData`), not on raw HTTP endpoints.

---

## Step-by-Step Guide to Creating a New Story

Let's say you've created a new component called `MyComponent` that fetches a user's profile data.

### 1. Create the Story File

Create a new file named `MyComponent.stories.tsx` inside the same directory as your component (`deso-ui/src/components/deso/MyComponent.stories.tsx`).

### 2. Basic Story Boilerplate

Add the basic boilerplate for a Storybook file. This includes the `meta` object for configuration and the base `Story` type.

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants';
import { successHandlers, errorHandlers, loadingHandlers } from '../../lib/mocks/msw-handlers';

const meta: Meta<typeof MyComponent> = {
  title: 'DeSo/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    // Define arg types for your component's props here
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
```

### 3. Add Centralized Mock Handlers

Instead of creating local mock handlers in every story, we use a set of shared handlers defined in `deso-ui/src/lib/mocks/msw-handlers.ts`. These handlers use a regular expression (`/GetProfile/`) to automatically respond to any GraphQL query whose name starts with "GetProfile".

To use them, import them and add them to the `parameters.msw.handlers` array in your story.

#### Default (Success) Story

This story represents the component when the data is fetched successfully.

```tsx
export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    // other props...
  },
  parameters: {
    msw: {
      handlers: successHandlers, // <-- Use the shared success handlers
    },
  },
};
```

#### Loading State Story

This story shows the component in its loading state. The `loadingHandlers` introduce an artificial delay before responding, allowing you to test your loading UI.

```tsx
export const Loading: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: loadingHandlers, // <-- Use the shared loading handlers
    },
  },
};
```

#### Error State Story

This story simulates an API error. The `errorHandlers` return a GraphQL error response, allowing you to test your component's error handling and fallback UI.

```tsx
export const Error: Story = {
  args: {
    publicKey: 'invalid-key',
  },
  parameters: {
    msw: {
      handlers: errorHandlers, // <-- Use the shared error handlers
    },
  },
};
```

### 4. Handling Special Cases (Optional)

If your story needs a specific mock response that isn't covered by the default handlers (e.g., a profile with no cover photo), you can use or create a specific handler in `msw-handlers.ts`.

For example, the `ProfileCard` story uses `noCoverHandlers` to test its fallback UI.

```tsx
import { noCoverHandlers } from '../../lib/mocks/msw-handlers';

export const ProfileWithoutCover: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: noCoverHandlers, // <-- Use a specific handler for this case
    },
  },
};
```

By following this structure, we keep our stories clean, consistent, and focused on the component's behavior, while the complexities of data mocking are abstracted away into a centralized, reusable system.

---

## Important Gotchas and Best Practices

### 1. Apollo Client Cache and Mock Data

**Problem:** You might see console errors from Apollo Client about being unable to write to the cache, or your component might not render data even though MSW returns a 200 OK status.

**Cause:** Apollo Client uses data normalization to maintain a consistent cache. To do this, it needs a unique identifier for each data object. By default, it looks for an `id` or `_id` field. For our DeSo data, it's crucial that any object type that can be queried (like `accountByPublicKey`) includes a unique identifier in the query and the corresponding mock data.

**Solution:**

*   **In your GraphQL Query:** Always include `id` and `publicKey` when querying for an object like `accountByPublicKey`.
*   **In your Mock Data (`deso-data.ts`):** Ensure that the mock objects you create have `id` and `publicKey` fields that match what the query expects.

```ts
// Example of a well-formed mock object in deso-data.ts
const baseProfile = {
  id: '1', // <-- Crucial for Apollo cache
  publicKey: DEFAULT_PUBLIC_KEY, // <-- Crucial for Apollo cache
  username: DEFAULT_USERNAME,
  description: 'A mock description.',
  // ... other fields
};
```

### 2. Fetching Live Data in a Story

There are times when you want a story to hit the actual DeSo API instead of using mocks. This is useful for verifying real-world data shapes and component behavior.

**Steps to Enable Live Data:**

1.  **Remove MSW Handlers from the Story:** In your `.stories.tsx` file, simply remove the `parameters` object that contains the `msw` handlers from the story you want to be live.

    ```tsx
    // This story will now make a real API call
    export const Live: Story = {
      name: 'Live Data',
      args: {
        publicKey: 'BC1YLjSGY3DETtVTsiDVkobtvfDDtMuTjFoG1rmSagtWPzHyEZ3BKuB',
      },
      // No parameters.msw object here!
    };
    ```

2.  **Configure MSW to Bypass Unhandled Requests:** In `.storybook/preview.tsx`, make sure MSW is initialized to let unhandled requests pass through to the network.

    ```tsx
    // .storybook/preview.tsx
    import { initialize } from 'msw-storybook-addon';

    initialize({
      onUnhandledRequest: 'bypass', // <-- This is the key!
    });
    ```

### 3. Data Structure Mismatches

**Problem:** Your component is blank, but the network request shows a 200 OK and contains the data you expect.

**Cause:** The component is likely trying to access data using an incorrect path. For example, the live API might return a user's bio in a top-level `description` field, while the mock data (or your component's code) might expect it at `extraData.MarkdownDescription`.

**Solution:**

*   **Always check the live API response:** Use your browser's network tools to inspect the JSON response from a real API call.
*   **Ensure consistency:** Make sure your component's data access logic (`profile.description`), your GraphQL queries, and your mock data structures all align perfectly with the live API.
*   **Use higher-level hooks:** Whenever possible, use abstracted hooks like `useProfile` instead of lower-level ones like `useParsedProfileQuery`. The higher-level hooks are designed to return data in a consistent and easy-to-use shape. 