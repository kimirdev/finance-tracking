# Finance Tracking

This is my pet project that I created to practice and expand my skills with various technologies. I've combined familiar tools from my professional experience with new technologies I wanted to learn. The project serves as both a practical finance tracking application and a learning platform for modern web development practices.

## ✨ Features

-   **Multi-Profile Support**: Create and switch between multiple user profiles, each with its own independent expense data.
-   **Expense Management**: Add, view, edit, and delete expenses with details like title, amount, category, date, and comments.
-   **Expense Filtering**: Filter expenses by predefined periods (last day, week, month, year, all time).
-   **Statistical Overview**: View expense statistics, categorized for better insights (e.g., by category).
-   **Local Storage Backend**: Utilizes browser's `localStorage` as a "fake backend" for persistent data storage, allowing for easy transition to a real backend later.
-   **Responsive Design**: Adapts to different screen sizes, providing a seamless experience on both desktop and mobile.
-   **Form Validation**: Robust form validation powered by `react-hook-form` and `Zod`.
-   **Theme Switching**: Dark and light theme support.

## 📁 Project Structure (Feature-Sliced Design)

This project follows the [Feature-Sliced Design (FSD)](https://feature-sliced.design/) methodology for scalable and maintainable architecture. Key layers include:

-   `app/`: Application-level logic, routing, and providers.
-   `pages/`: Application pages.
-   `widgets/`: Independent, reusable UI blocks that combine features and entities.
-   `features/`: Implementations of user stories, containing logic and UI specific to a feature.
-   `entities/`: Domain-specific business logic and data models (e.g., `expense`, `profile`).
-   `shared/`: Reusable utilities, UI components, and libraries used across the application.

## 🛠️ Technologies Used

-   **React 19**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Vite**: A fast build tool that provides a lightning-fast development experience.
-   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
-   **Shadcn/ui**: Reusable components built with Tailwind CSS and Radix UI.
-   **Zustand**: A small, fast, and scalable bearbones state-management solution.
-   **TanStack Query (React Query)**: Powerful asynchronous state management for fetching, caching, and updating data.
-   **React Hook Form**: Performant, flexible and extensible forms with easy-to-use validation.
-   **Zod**: A TypeScript-first schema declaration and validation library.
-   **Recharts**: A composable charting library built with React and D3.
-   **Vitest**: A blazing fast unit test framework powered by Vite.
-   **@testing-library/react**: Utilities for testing React components.

## 🚀 Getting Started

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Ensure you have Node.js and npm (or yarn/pnpm) installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/kimirdev/finance-tracking.git
    cd finance-tracking
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

### Running the Development Server

```bash
npm run dev
# or yarn dev
# or pnpm dev
```

This will start the development server, and the application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

```bash
npm run build
# or yarn build
# or pnpm build
```

This will build the application for production in the `dist` directory.

## ✅ Running Tests

This project uses [Vitest](https://vitest.dev/) for unit and integration testing. Ensure your `vitest.config.ts` and `tsconfig.json` are correctly configured for path aliases (`@/`).

To run all tests once:

```bash
npm test
```

To run tests in watch mode (re-runs tests on file changes):

```bash
npm run test:watch
```

Feel free to contribute or suggest improvements!
