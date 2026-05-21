# Zest State Management Roadmap

This document stores the long-term learning and refactor plan for the Zest project. It is intentionally written as a mentor plan, not an implementation task list for an assistant to execute automatically.

## Ground Rules

- The assistant must not implement Redux Toolkit, Zustand, middleware, or related state-management refactors automatically.
- The user implements the changes. The assistant mentors by explaining, reviewing diffs, suggesting next steps, and helping debug when asked.
- Keep each exercise small enough to understand before moving to the next one.
- Prefer existing project behavior over speculative feature expansion.
- Preserve the current user-facing app behavior unless an exercise explicitly changes it.
- Run tests/build/lint only when useful for verification, and explain what the result proves.

## Source Material Summary

The roadmap is based on `D:\React State Management.pdf`.

Key ideas from the PDF:

- Context API is suitable for simple shared state such as theme, language, basic auth user, and app config.
- Context API becomes weaker when state grows large, updates often, or needs complex data fetching and predictable updates.
- Redux provides a single global store, action history, predictable reducer-based updates, DevTools, and a standard architecture.
- Redux Toolkit reduces old Redux boilerplate with slices, built-in Immer, built-in thunk, simpler setup, and best-practice defaults.
- Middleware is the right place for cross-cutting side effects such as logging, analytics, auth validation, token handling, persistence, and async flow control.
- Zustand is minimal, hook-based, fast to set up, and useful for simple global state, but depends more on team convention than Redux.

## Current Zest State Map

Current app state is distributed like this:

- `src/context/ThemeContext.jsx`
  - Stores `theme`.
  - Syncs `data-theme` to `document.documentElement`.
  - Persists `zest-theme` to `localStorage`.
  - This is a good Context API use case.

- `src/context/AuthContext.jsx`
  - Stores `user` and `authError`.
  - Handles fake login/logout using `src/data/users.js`.
  - Persists `zest-user` to `localStorage`.
  - This can stay Context initially because auth is simple.

- `src/context/CartContext.jsx`
  - Uses `useReducer`.
  - Stores `items`.
  - Supports add, remove, increase, decrease, clear, and load cart.
  - Derives `totalItems`, `subtotal`, and `isEmpty`.
  - Persists cart per user with keys like `zest-cart-{user.id}` and `zest-cart-guest`.
  - This is the best first Redux Toolkit candidate.

- `src/hooks/useBooks.js`
  - Fetches books from Open Library.
  - Stores `products`, `loading`, and `error`.
  - Reads/writes `zest-books-cache` with a 24-hour TTL.
  - This is the best `createAsyncThunk` and async state candidate.

- `src/pages/HomePage.jsx`
  - Stores `searchQuery`, `activeCategory`, `currentPage`, and `isLoginOpen`.
  - Derives `filteredBooks` and `paginatedBooks`.
  - This can stay local first. Later, some UI state can move to Zustand for comparison.

- `src/components/Header.jsx`
  - Stores `isCartOpen` and `isSideOpen`.
  - Locks body scroll and handles Escape key.
  - This is a good Zustand candidate if the goal is to learn lightweight global UI state.

## Target Architecture For Learning

The likely end-state after the learning path:

```text
src/
  app/
    store.js
  features/
    cart/
      cartSlice.js
      cartSelectors.js
      cartPersistenceMiddleware.js
    books/
      booksSlice.js
      booksThunks.js
      booksSelectors.js
  stores/
    uiStore.js
  context/
    AuthContext.jsx
    ThemeContext.jsx
```

This is not a required final folder structure. It is a teaching target that can be adjusted to fit the project as it evolves.

Expected ownership:

- Redux Toolkit owns complex global domain state:
  - cart
  - books async state

- Zustand owns lightweight global UI state:
  - cart drawer open/closed
  - side menu open/closed
  - login modal open/closed
  - optionally theme, only if the user wants to compare with Context

- Context can continue to own simple app-level concerns:
  - auth user
  - theme, unless moved for learning

- Local component state remains local:
  - form fields
  - password visibility
  - image load errors
  - temporary input state

## Phase 0: Baseline Understanding

Goal: understand the current implementation before changing it.

User exercises:

1. Draw the current provider tree from `src/App.jsx`.
2. List every action in `CartContext.jsx` and write one example payload for each.
3. Explain why `CartContext` uses `useReducer` instead of several `useState` calls.
4. Explain which code is pure reducer logic and which code is side effect.
5. Trace what happens when a user clicks `Add to Cart` in `ProductCard.jsx`.

Mentor review checklist:

- Can the user distinguish state, derived state, actions, reducers, and effects?
- Can the user explain why localStorage should not be inside a reducer?
- Can the user explain why cart depends on auth user for the storage key?

Do not move to Redux until these are clear.

## Phase 1: Redux Toolkit Setup

Goal: add Redux Toolkit infrastructure without moving business logic yet.

Concepts to learn:

- `configureStore`
- `<Provider store={store}>`
- Redux DevTools
- feature folder structure
- slice boundaries

Suggested user tasks:

1. Install dependencies:

   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. Create `src/app/store.js`.
3. Wrap the app with React Redux `Provider`.
4. Add an empty starter reducer only if needed to validate setup.
5. Confirm Redux DevTools can see the store.

Mentor review checklist:

- Store setup is minimal.
- Provider placement is correct.
- No cart/auth/books logic has moved yet.
- The app still renders.

Expected questions:

- Why does Redux need a Provider but Zustand does not?
- Why is the Redux store outside React components?
- What does Redux DevTools show before we add real slices?

## Phase 2: Cart Slice

Goal: convert cart reducer logic from Context to Redux Toolkit.

Concepts to learn:

- `createSlice`
- generated action creators
- Immer-style mutation syntax
- payload shape
- reducer purity
- replacing wrapper functions with dispatched actions

Suggested user tasks:

1. Create `src/features/cart/cartSlice.js`.
2. Define initial state:

   ```js
   {
     items: []
   }
   ```

3. Port current cart actions:
   - `addItem`
   - `removeItem`
   - `increaseQuantity`
   - `decreaseQuantity`
   - `clearCart`
   - `loadCart`

4. Keep reducer logic pure.
5. Register `cart` reducer in the store.
6. Temporarily keep `CartContext` until the Redux slice is validated, or replace it only after selectors/actions are ready.

Mentor review checklist:

- Reducers do not read/write localStorage.
- Reducer names describe events or commands clearly.
- Payloads are consistent.
- Existing behavior is preserved:
  - adding an existing item increases quantity
  - decreasing from 1 removes item
  - clearing removes all items
  - loading replaces cart items

Discussion prompts:

- In old reducer style, why did we return new objects?
- In Redux Toolkit, why is `state.items.push(...)` acceptable?
- Which action should carry a full book object and which should carry only an id?

## Phase 3: Cart Selectors

Goal: move derived cart calculations out of components and into selectors.

Concepts to learn:

- `useSelector`
- selector functions
- derived state
- memoization only when needed

Suggested user tasks:

1. Create `src/features/cart/cartSelectors.js`.
2. Add selectors:
   - `selectCartItems`
   - `selectTotalItems`
   - `selectSubtotal`
   - `selectIsCartEmpty`
   - `selectCartItemById`

3. Update consumers gradually:
   - `Header.jsx` reads total items.
   - `CartDrawer.jsx` reads items/subtotal/isEmpty.
   - `ProductCard.jsx` reads whether a book is already in the cart.

Mentor review checklist:

- Components no longer recalculate shared derived data unnecessarily.
- Selectors are simple and readable.
- Dynamic selector usage for `selectCartItemById` is understood.

Discussion prompts:

- What is the difference between state and derived state?
- Why should subtotal not be stored directly in Redux?
- When would `createSelector` be useful?

## Phase 4: Cart Persistence Middleware

Goal: move localStorage cart persistence out of React effects and into middleware.

Concepts to learn:

- Redux middleware signature
- action interception
- `next(action)`
- side effects outside reducers
- persistence by action type

Suggested user tasks:

1. Create `src/features/cart/cartPersistenceMiddleware.js`.
2. Listen for cart-changing actions:
   - `addItem`
   - `removeItem`
   - `increaseQuantity`
   - `decreaseQuantity`
   - `clearCart`
   - `loadCart`, only if persistence after loading is intentional

3. Persist the current cart after the reducer processes the action.
4. Keep the user-specific key behavior:
   - logged in: `zest-cart-{user.id}`
   - guest: `zest-cart-guest`

Important design issue:

Redux cart middleware needs access to the current user id. Decide intentionally:

- Option A: keep auth in Context and pass user id into cart load/persistence logic through explicit actions.
- Option B: move auth to Redux before middleware becomes user-aware.
- Option C: keep cart loading in a small React bridge component while persistence middleware handles only writes.

Recommended learning path:

- Start with Option C because it teaches middleware without forcing auth migration too early.

Mentor review checklist:

- Middleware calls `next(action)` exactly once.
- Persistence happens after state changes when needed.
- Reducers stay pure.
- Invalid localStorage data is handled outside reducers.

Discussion prompts:

- Why is localStorage a side effect?
- Why should middleware usually call `next(action)` before reading updated state?
- What bugs happen if middleware swallows an action?

## Phase 5: Books Slice And createAsyncThunk

Goal: replace `useBooks` internal fetch state with Redux Toolkit async state.

Concepts to learn:

- `createAsyncThunk`
- `pending`, `fulfilled`, `rejected`
- `extraReducers`
- request lifecycle
- normalized versus array state, at a basic level

Suggested user tasks:

1. Create `src/features/books/booksThunks.js`.
2. Create `src/features/books/booksSlice.js`.
3. Move async fetch lifecycle into Redux:
   - `status: 'idle' | 'loading' | 'succeeded' | 'failed'`
   - `items: []`
   - `error: null`

4. Keep `fetchBook` in `src/data/products.js` as the API function.
5. Dispatch fetch when the page mounts if status is `idle`.
6. Replace `useBooks` or convert it into a thin Redux hook wrapper.

Mentor review checklist:

- API function stays separate from Redux slice.
- Slice handles pending/fulfilled/rejected clearly.
- Component does not manually manage loading/error for books.
- Fetch does not repeat unnecessarily on every render.

Discussion prompts:

- Why does async code not belong inside a reducer?
- What is the difference between `loading` boolean and `status` enum?
- Where should transformation from Open Library data to app model happen?

## Phase 6: Books Cache Strategy

Goal: move the 24-hour books cache into a cleaner boundary.

Concepts to learn:

- cache helper/service
- thunk condition
- middleware versus thunk responsibility
- cache invalidation

Suggested user tasks:

1. Extract cache helpers:
   - read cache
   - write cache
   - clear expired cache

2. Decide whether cache is handled:
   - inside the thunk
   - in a middleware
   - in a small service used by the thunk

Recommended learning path:

- Use a small service first. Middleware for API cache is more advanced and can obscure the core `createAsyncThunk` lesson.

Mentor review checklist:

- TTL logic is testable without React.
- Cache failures do not break the app.
- User can explain why cache is a side effect.

Discussion prompts:

- Is cache part of Redux state or storage state?
- When should cached data become stale?
- Should a failed cache read block a network fetch?

## Phase 7: Zustand For UI State

Goal: learn Zustand by moving lightweight UI state, not domain data.

Concepts to learn:

- `create`
- store as a hook
- selector usage
- actions inside Zustand store
- conventions and naming

Suggested user tasks:

1. Install Zustand:

   ```bash
   npm install zustand
   ```

2. Create `src/stores/uiStore.js`.
3. Move UI state:
   - `isCartOpen`
   - `isLoginOpen`
   - `isSideOpen`

4. Add actions:
   - `openCart`
   - `closeCart`
   - `openLogin`
   - `closeLogin`
   - `openSideMenu`
   - `closeSideMenu`
   - `closeAllOverlays`

5. Keep form fields inside `LoginModal.jsx`.

Mentor review checklist:

- Zustand is used for UI coordination, not everything.
- Components subscribe only to the state/actions they need.
- Store naming is consistent.
- Overlay closing behavior remains the same.

Discussion prompts:

- Why is Zustand simpler here than Redux?
- What conventions does the team need because Zustand is less strict?
- Which state should stay local even after adding Zustand?

## Phase 8: Optional Theme Comparison

Goal: compare Context versus Zustand for a simple global value.

This phase is optional because the PDF explicitly says theme is a good Context API use case.

Suggested user tasks:

1. Keep `ThemeContext` and explain why it is acceptable.
2. Optionally implement theme in Zustand on a branch.
3. Compare code size, readability, and coupling.
4. Decide which version is better for this project.

Mentor review checklist:

- The decision is based on project needs, not tool novelty.
- DOM and localStorage side effects remain isolated.
- The user can explain when Context is enough.

## Phase 9: Cleanup And Documentation

Goal: document the final architecture and remove transitional code.

Suggested user tasks:

1. Update `README.md` architecture section.
2. Remove unused contexts/hooks only after replacement is complete.
3. Ensure old localStorage keys are still compatible or document migration.
4. Add a short state ownership table:
   - Redux
   - Zustand
   - Context
   - Local state

Mentor review checklist:

- No duplicate source of truth remains.
- Components import state from the chosen owner.
- README reflects actual code, not intended code.

## Suggested Review Format

When the user sends a patch, review in this order:

1. Correctness and behavior changes.
2. State ownership and architecture.
3. Redux/Zustand concept usage.
4. Naming and readability.
5. Tests or manual verification.

Prefer focused review comments. Avoid rewriting the user's code unless explicitly asked.

## Good First Assignment

Start with cart because it already has reducer-style logic.

Assignment:

1. Read `src/context/CartContext.jsx`.
2. Write down each action and payload.
3. Create a draft `cartSlice.js`.
4. Do not connect it to the app yet.
5. Ask for review.

Acceptance criteria:

- The slice exports reducer and action creators.
- It has the same behavior as the current reducer.
- It contains no localStorage calls.
- It is understandable without reading the old Context file.

## Known Non-State Backlog

These are not part of the state-management roadmap, but they were noticed during review:

- `src/components/LoginModal.jsx` destructures `isLoggIn`, which appears to be a typo and is unused.
- `src/components/Pagination.jsx` imports `use` from React but does not use it.
- `src/components/Pagination.jsx` has a condition `totalPages <= 1 && totalPages >= 50`, which can never be true.
- `src/components/Pagination.jsx` uses lowercase `prevBtn` and `nextBtn` functions as JSX tags. React components should be PascalCase.

Handle these separately so the learning refactor stays focused.
