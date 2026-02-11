# Next.js Frontend

The user interface for SantaiWorks CRM, built with Next.js 16.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
1.  Navigate to the directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Create a `.env.local` file based on `.env.example` (if available) or add:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

### Running for Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production
```bash
npm run build
npm start
```

## 🛠️ Features
- **Dashboard:** Real-time metrics and analytics.
- **Leads Management:** Consolidated view for leads and deals.
- **Data Tables:** Server-side filtering and sorting.
- **Responsive Design:** Optimized for all screen sizes.

## 🏗️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Hooks
- **Data Fetching:** Standard `fetch` API / Server Actions
