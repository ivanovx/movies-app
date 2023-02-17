import React from "react";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";

import ElasticProvider from "./components/Elastic";
import Search from './components/Search';


const Home = () => (
    <ul className="nav justify-content-center">
        <li className="nav-item">
            <Link to="en" className="nav-link">Movies</Link>
        </li>
        <li className="nav-item">
            <Link to="bg" className="nav-link">Bulgarian Movies</Link>
        </li>
    </ul>
);

const Movies = () => {
    const indexName = 'movies';
    const availableFields = [
        'title',
        'actors',
        'characters'
    ];

    return (
        <Search indexName={indexName} availableFields={availableFields} />
    );
};

const BgMovies = () => {
    const indexName = 'bgmovies';
    const availableFields = [
        'title',
        'actors',
        'characters'
    ];

    return <Search indexName={indexName} availableFields={availableFields} />
};


const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/en',
        element: <Movies />,
    },
    {
        path: '/bg',
        element: <BgMovies />,
    }
]);

export default function App() {


    return (
        <div className="container">
            <ElasticProvider>
                <RouterProvider router={router} />
            </ElasticProvider>
        </div>
    );
}