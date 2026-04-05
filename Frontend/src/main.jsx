import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Pages imports
import Home from './pages/Home.jsx'
import VideoDetail from './pages/VideoDetail.jsx'
import MyChannel from './pages/MyChannel.jsx'

// Sabhi components ko index.js se ek hi line mein mangao
import { AuthLayout, Login, Signup, UploadVideo } from './components'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: (
                <AuthLayout authentication={false}>
                    <Login />
                </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                    <Signup />
                </AuthLayout>
            ),
        },
        {
            path: "/video/:videoId",
            element: (
                <AuthLayout authentication>
                    <VideoDetail />
                </AuthLayout>
            ),
        },
        {
            path: "/add-video",
            element: (
                <AuthLayout authentication>
                    <UploadVideo />
                </AuthLayout>
            ),
        },
        {
            path: "/all-videos",
            element: (
                <AuthLayout authentication>
                    <Home />
                </AuthLayout>
            ),
        },
        {
            path: "/my-channel",
            element: (
                <AuthLayout authentication>
                    <MyChannel />
                </AuthLayout>
            ),
        },
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)