import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import UploadPage from './pages/UploadPage'
import CallStatusPage from './pages/CallStatusPage'
import CallDetailsPage from './pages/CallDetailsPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <UploadPage /> },
            { path: '/calls/:id', element: <CallStatusPage /> },
            { path: '/calls/:id/details', element: <CallDetailsPage /> },
        ],
    },
])
