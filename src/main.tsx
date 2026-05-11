import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from 'pages/client/book.tsx';
import AboutPage from 'pages/client/about.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import "styles/global.scss"
import HomePage from 'pages/client/home';
import { App } from 'antd';
import { AppProvider } from '@/components/context/app.context';
import ProtectedRoute from '@/components/auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <div>Checkout Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>Admin page</div>
          </ProtectedRoute>
        ),
      },

    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>,
)
