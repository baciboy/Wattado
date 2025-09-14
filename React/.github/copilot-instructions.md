# GitHub Copilot Custom Instructions for [Your Project Name]

## 🧭 Project Overview
This repository hosts a React application designed to aggregate and display events from various APIs, such as Ticketmaster, Seatgeek, and PredictHQ. The application aims to provide users with a comprehensive list of events, complete with details and direct links to purchase tickets.

## 🛠️ Tech Stack & Tools
- **Frontend**: React 18+, JSX, CSS Modules
- **Backend**: Node.js with Express.js (for API proxying)
- **State Management**: React Context API or Redux
- **Package Management**: Use [pnpm](https://pnpm.io/) for efficient dependency management
- **Styling**: CSS Modules or Tailwind CSS
- **API Integration**: Axios for HTTP requests
- **Environment Variables**: Store sensitive information in `.env` files, ensuring they are added to `.gitignore`

## ✅ Coding Standards & Best Practices
- **Component Structure**: Utilize functional components with hooks (`useState`, `useEffect`, `useContext`).
- **Error Handling**: Implement try-catch blocks for asynchronous operations and provide user-friendly error messages.
- **Code Quality**: Adhere to ESLint and Prettier configurations for consistent code formatting.
- **Security**: Never hardcode API keys or secrets in the codebase. Always use environment variables.
- **Performance**: Optimize components using `React.memo` and `useMemo` where applicable to prevent unnecessary re-renders.
- **Testing**: Write unit and integration tests using Jest and React Testing Library.

## 🔐 API Integration Guidelines
- **Backend Proxy**: All API requests should be routed through a backend server to keep API keys secure.
- **API Endpoints**:
  - `/api/ticketmaster/events`: Fetch events from the Ticketmaster API.
  - `/api/seatgeek/events`: Fetch events from the Seatgeek API.
  - `/api/predicthq/events`: Fetch events from the PredictHQ API.
- **Data Handling**: Normalize and merge data from different APIs to present a unified event list.
- **Pagination**: Implement pagination or infinite scrolling for displaying large sets of events.

## 🧪 Testing & Validation
- **Unit Tests**: Ensure each component and utility function has corresponding unit tests.
- **Integration Tests**: Test the interaction between components and the backend API.
- **End-to-End Tests**: Use tools like Cypress to simulate user interactions and validate the application's behavior.

## 📦 Package Management
- **pnpm**: Use pnpm for faster and more efficient package management.
  - To install pnpm: `npm install -g pnpm`
  - To install dependencies: `pnpm install`
  - To add a package: `pnpm add <package-name>`
  - To remove a package: `pnpm remove <package-name>`

## 🔄 Version Control & Collaboration
- **Branching**: Use feature branches for new developments and bug fixes.
- **Commits**: Write clear and concise commit messages following the Conventional Commits specification.
- **Pull Requests**: Always create pull requests for code reviews before merging into the main branch.

## 🛠️ Development Workflow
- **Local Development**: Use `npm run dev` or `pnpm dev` to start the development server.
- **Build**: Use `npm run build` or `pnpm build` to create a production-ready build.
- **Linting & Formatting**: Run `npm run lint` or `pnpm lint` to check for code quality issues.
- **Testing**: Run `npm test` or `pnpm test` to execute tests.

## 📚 Resources
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)
- [pnpm Documentation](https://pnpm.io/)

## 🧠 Copilot Usage Tips
- Provide clear and concise comments to guide Copilot in generating the desired code.
- Use Copilot's suggestions as a starting point and customize them to fit the project's requirements.
- Regularly review and refactor code to maintain high code quality and performance.
