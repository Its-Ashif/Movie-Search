import React, {useEffect,useState} from 'react'
import { useDebounce } from 'use-debounce';
import './App.css'
import Search from './components/search.jsx'
import MovieCard from "./components/MovieCard.jsx";
import MyLoader from "./components/MyLoader.jsx";
import 'react-loading-skeleton/dist/skeleton.css';
import {getTrending, updateSearchCount} from "./appwrite.js";
import TrendingCard from "./components/trendingCard.jsx";


const API_BASE_URL = 'https://api.themoviedb.org/3/';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + API_KEY,
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
    const [trending, setTrending] = useState([]);

    const fetchMovies = async (query='') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS)

            if(!response.ok){
                throw new Error('Failed to fetch movies.');
            }
            const data = await response.json();

            if(data.Response === 'False'){
                setErrorMessage(data.Error || "Failed to fetch movies.");
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);
            const trimmed = (query || '').trim();
            if(trimmed && data.results.length > 0){
                await updateSearchCount(trimmed,data.results[0]);
            }
        } catch(error){
            console.log('Error in fetchMovies: '+error);
            setErrorMessage('Error fetching movies. Please try again.');
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const loadTrending = async () => {
            try{
                const doc = await getTrending();
                setTrending(doc);
            } catch(error){
                console.error(error);
            }
        }
        loadTrending();
    },[])

    return (
        <main className="relative min-h-screen overflow-x-hidden">
            <div className="pattern" />

            <div className="wrapper overflow-x-hidden">
                <header>
                    <img src="../public/hero.png" alt="hero banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                <section className="trending">
                    <h2 className="">Trending</h2>
                    <div className="overflow-x-auto ">
                        <ul className="overflow-y-hidden overflow-x-auto flex flex-col md:flex-row md:align-center md:justify-center md:mx-auto md:my-auto">
                            {trending.map((trending, index) => (
                                <div  key={trending.movie_id}>
                                    <TrendingCard movie={trending} id={index + 1}/>
                                </div>
                            ))}
                        </ul>
                    </div>

                </section>

                <section className="all-movies">
                    <h2 className="mt-10">All Movies</h2>

                    {isLoading ? ( <ul>{Array.from({ length: 6 }).map((_, i) => (
                            <MyLoader key={i} />
                        ))}</ul>)
                        : errorMessage ? (<p className="text-red-500">{errorMessage}</p>)
                            : ( <ul>{movieList.map((movie)=>(<MovieCard key={movie.id} movie={movie}/> ))}</ul>)}
                </section>

            </div>
        </main>
    )
}
export default App

