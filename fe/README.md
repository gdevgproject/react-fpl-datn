# 🚀 React + Vite with React Router, Tailwind CSS, TypeScript & Redux Toolkit

This template provides a minimal yet powerful setup to get React running with Vite, featuring:

- **✅ Fast HMR (Hot Module Replacement) via Vite**
- **✅ Modern Styling with Tailwind CSS**
- **✅ State Management using Redux Toolkit**
- **✅ Client-side Routing powered by React Router**
- **✅ Optimized Development Workflow with ESLint rules**

## ✨ Features

- **Lightning-fast builds with Vite 🚀**
- **Hot Module Replacement (HMR) for instant updates**
- **Flexible state management with Redux Toolkit**
- **Efficient styling using Tailwind CSS**
- **Declarative routing with React Router**
- **Optional Babel or SWC support for React Fast Refresh**

## 🔌 Official Plugins Available

Vite provides two official plugins for React:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses [SWC](https://swc.rs/) for Fast Refresh.

## 🚀 Getting Started

## Step 0: Setup Project

First, create the project using Vite:

```bash
yarn create vite
```

Then, navigate into your project directory:

```bash
cd <project-name>
```

Next, install the necessary dependencies for Tailwind CSS and React Router:

```bash
yarn add tailwindcss @tailwindcss/vite react-router-dom @reduxjs/toolkit react-redux
```

* **Tailwind CSS & Vite Config (`vite.config.js`):** [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite)

## Step 1: Install ESLint and Prettier Packages

Run the following command to install the necessary packages:

```bash
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-tailwindcss @types/node
```

### Package Descriptions

- **prettier**: A code formatter.
- **eslint-config-prettier**: Disables ESLint rules that conflict with Prettier.
- **eslint-plugin-prettier**: Adds Prettier rules to ESLint.
- **prettier-plugin-tailwindcss**: A Prettier plugin that automatically sorts Tailwind CSS classes in a logical and consistent order.

## Step 2: Configure ESLint for Code Standardization

1. Open the `eslint.config.js` file.
2. Add the following value to the `ignores` array to exclude `vite.config.ts` from ESLint checks:

   ```javascript
   'vite.config.ts'
   ```

3. Import the Prettier plugin at the top of the `eslint.config.js` file:

   ```javascript
   import eslintPluginPrettier from 'eslint-plugin-prettier'
   ```

4. Add the Prettier plugin to the `plugins` object:

   ```javascript
   prettier: eslintPluginPrettier
   ```

5. Add the following Prettier rules to the `rules` object:

   ```javascript
   'prettier/prettier': [
     'warn',
     {
       arrowParens: 'always',
       semi: false,
       trailingComma: 'none',
       tabWidth: 2,
       endOfLine: 'auto',
       useTabs: false,
       singleQuote: true,
       printWidth: 120,
       jsxSingleQuote: true,
     }
   ]
   ```

## Step 3: Configure Prettier for Code Formatting

1. Create a `.prettierrc` file in the root directory with the following content:

   ```json
   {
     "arrowParens": "always",
     "semi": false,
     "trailingComma": "none",
     "tabWidth": 2,
     "endOfLine": "auto",
     "useTabs": false,
     "singleQuote": true,
     "printWidth": 120,
     "jsxSingleQuote": true,
     "plugins": ["prettier-plugin-tailwindcss"]
   }
   ```

   This file configures Prettier for consistent code formatting. Install the "Prettier - Code formatter" extension in VS Code for better integration.

2. Create a `.prettierignore` file in the root directory to exclude unnecessary files from Prettier formatting:

   ```
   node_modules/
   dist/
   ```

## Step 4: Configure Editor for Standardized Settings

1. Create a `.editorconfig` file in the root directory to synchronize editor settings across team members:

   ```ini
   [*]
   indent_size = 2
   indent_style = space
   ```

   Install the "EditorConfig for VS Code" extension in VS Code to enable this configuration.

## Step 5: Add Scripts to `package.json`

1. Open the `package.json` file in the root directory.
2. Add the following scripts under the `"scripts"` section:

   ```json
   "scripts": {
     "lint:fix": "eslint . --fix",
     "prettier": "prettier --check \"src/**/(*.tsx|*.ts|*.css|*.scss)\"",
     "prettier:fix": "prettier --write \"src/**/(*.tsx|*.ts|*.css|*.scss)\""
   }
   ```

   These scripts help you automate code linting and formatting tasks:

   - **lint:fix**: Fixes linting errors automatically.
   - **prettier**: Checks the formatting of specified files.
   - **prettier:fix**: Formats the specified files automatically.
  
## Step 6: Configure Path Aliases `tsconfig.app.json`

1. Open the `tsconfig.app.json` file in the root directory.
2. Add the following scripts inside the `"compilerOptions"` section:

   ```json
   "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
   ```

## Step 7: Configure Alias for Vite in `vite.config.ts`

1. Open the `vite.config.ts` file in the root directory.
2. Add the following scripts below the `"plugins"` section:

   ```ts
   import path from 'path';
   resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
   }
   ```

---

By following these steps, you ensure that your project maintains consistent formatting and coding standards across all contributors.

---

# Professional File Structure using "Feature Based Structure"

## /features

- Each feature folder contains all the components, custom hooks, and all the JS files required for that feature to work (co-located).
- This structure eliminates the need to constantly jump around the folder hierarchy.

## /ui

- This folder contains reusable components such as buttons, inputs, etc.
- These components are not tied to any specific feature.
- It should not contain side effects, only presentation-related code.

## /services

- This folder is used for interacting with external APIs.
- It's designed for reuse across different features and handles API requests.

## /utils

- Contains stateless helper functions.
- These functions should not have side effects and are reusable across various parts of the application.

---
