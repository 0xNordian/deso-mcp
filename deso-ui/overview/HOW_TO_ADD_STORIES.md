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