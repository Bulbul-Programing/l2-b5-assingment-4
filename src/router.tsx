import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Books from "./Pages/Books";
import BorrowSummery from "./Pages/BorrowSummery";
import BookDetails from "./MyComponent/Books/BookDetails";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/books',
                element: <Books />
            },
            {
                path: '/borrow-summary',
                element: <BorrowSummery />
            },
            {
                path: '/books/:bookId',
                element: <BookDetails />
            }
        ]
    },
])

export default router