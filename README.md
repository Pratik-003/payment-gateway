# Frontend Assignment – Payment Gateway

A fully responsive, simulated Payment Gateway built with Next.js (App Router), TypeScript, and Tailwind CSS. It manages complex form validation, auto-formatting, and simulates network delays and failures.

## 🚀 Tech Stack & Justifications

* **Framework:** Next.js (App Router) & React
* **Styling:** Tailwind CSS (for rapid, responsive UI development)
* **Validation:** React Hook Form + Zod
    * *Justification:* React Hook Form minimizes re-renders for performant typing, while Zod allows us to extract complex validation rules (like strict CVV lengths and dynamic expiry date checking) outside of the JSX.
* **State Management:** Zustand
    * *Justification:* The assignment allowed a choice between Redux Toolkit and Zustand. I chose Zustand because a payment flow's global state is highly localized (status tracking and transaction history). Redux introduces unnecessary boilerplate for this scale. Zustand provides a much cleaner hook-based API and makes persisting the transaction history to `localStorage` trivial via its persist middleware.

## ⚙️ Setup Instructions

1. Clone the repository:
   \`git clone <your-github-repo-link>\`
2. Navigate to the project directory:
   \`cd payment-gateway\`
3. Install dependencies:
   \`npm install\`
4. Run the development server:
   \`npm run dev\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 Assumptions Made
* **Mock Backend:** The backend is simulated using a Next.js Route Handler (`/api/pay`) running on the same server, rather than a separate Node/Express instance.
* **Idempotency:** The unique transaction UUID is generated on the client side before the *first* API call and reused for all subsequent retries to prevent duplicate processing.
* **Timeout Handling:** Used the native `AbortController` to cancel the fetch request precisely at 6 seconds if the mock server deliberately hangs.

## 🔮 What I would improve with more time
* **Testing:** Implement comprehensive unit tests using Vitest or Jest, specifically testing the Zod validation edge cases and the retry logic hook.
* **Accessibility:** Run the application through an automated screen reader test (like axe-core) to ensure 100% compliance beyond the implemented `aria-describedby` tags.
* **Animations:** Add Framer Motion for smoother transitions between the Payment Form and the Status Screens.