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

// Naye Pages/Components jo aapne banaye hain
import { 
    AuthLayout, 
    Login, 
    Signup, 
    UploadVideo, 
    Tweets // Agar components folder mein hai
} from './components'

// Agar Dashboard aapne pages mein banaya hai toh yahan import karein
// import Dashboard from './pages/Dashboard.jsx' 

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
        // --- NAYE ROUTES JO AAPNE MAANGE THE ---
        {
            path: "/community", // Tweets ke liye
            element: (
                <AuthLayout authentication>
                    <Tweets /> 
                </AuthLayout>
            ),
        },
        {
            path: "/dashboard", // Video Edit/Delete aur Stats ke liye
            element: (
                <AuthLayout authentication>
                    {/* Yahan aapka Dashboard component aayega */}
                    <MyChannel /> 
                </AuthLayout>
            ),
        },
        {
            path: "/subscriptions", // Jinko aapne subscribe kiya hai
            element: (
                <AuthLayout authentication>
                    <div className="text-white p-10 text-center text-2xl font-bold">
                        Channels you subscribed will appear here (Work in progress)
                    </div>
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