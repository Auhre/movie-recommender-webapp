import { useEffect, useState } from 'react';
import axios from "axios";
import './Movies.css'

function Movies() {
    const [moviesList, setMoviesList] = useState([])
    const [currMovieId, setcurrMovieId] = useState()
    const [likes, setLikes] = useState([])
    const [dislikes, setDislikes] = useState([])

    async function fetchMovies() {
        let res = await axios(`http://localhost:8080/movies`)
        let movies = res.data
        setMoviesList(movies)
    }

    function handleDragOver  (e) {
        e.preventDefault()
        fillMovieList() 
    }

    function addLikes(e) {
        e.preventDefault()
        if (likes.some(id => id === currMovieId)) {
            return
        }
        if (dislikes.some(id => id === currMovieId)) {
            return
        }
        setLikes([...likes, currMovieId])
    }
    
    function addDislikes(e) {
        e.preventDefault()
        if (likes.some(id => id === currMovieId)) {
            return
        }
        if (dislikes.some(id => id === currMovieId)) {
            return
        }
        setDislikes([...dislikes, currMovieId])
    }

    function colorMovie(idx) {
        if (likes.some(id => id === idx)) {
            return "green"
        }
        else if (dislikes.some(id => id === idx)) {
            return "red"
        }
        else return "default"
    }

    function fillMovieList() {
        let completeMovieList = []
        for (let i = 0; i < moviesList.length; i++) {
            completeMovieList.push(moviesList[i])
            if(moviesList[i+1] && moviesList[i+1].movie_id_id - moviesList[i].movie_id_id > 1) {
                let dummyObj = { movie_id_id: moviesList[i].movie_id_id+1, movie_name: "dummy", movie_genre: "dummy"}
                completeMovieList.push(dummyObj)
                
            }
        }
        setMoviesList(completeMovieList)
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    useEffect(() => {
    }, [likes, dislikes])
    
    const movies = moviesList.map(data => {
        if(data.movie_name === "dummy") return null
        return (<button 
                    key={data.movie_id_id} 
                    className={`draggable-${colorMovie(data.movie_id_id)}`} 
                    draggable="true" 
                    onDragStart={() => {setcurrMovieId(data.movie_id_id)}}
                >
                    {data.movie_name}
                </button>
        )
    })

    const likedMovies = likes.map(id => {
        return <button 
                    key={id} 
                    className="draggable-default" 
                    onClick={() => {setLikes(likes.filter(item => item !== id))}}
                >
                        {moviesList[id-1].movie_name}
                </button>
    })

    const dislikedMovies = dislikes.map(id => {
        return <button 
                    key={id} 
                    className="draggable-default" 
                    onClick={() => {setDislikes(dislikes.filter(item => item !== id))}}
                >
                    {moviesList[id-1].movie_name}
                </button>
    })

    return (
        <>
        <div className='modal-overlay'>
            <div className='movie-content'>
                <div style={{width: "100%", display: "flex", justifyContent: "center", color: "black"}}> 
                    Movie List 
                </div>
                {movies}
            </div>
            <div 
                className='liked-movies' 
                onDragOver={handleDragOver} 
                onDrop={addLikes}
            >
                <div style={{width: "100%", display: "flex", justifyContent: "center", height: "30px", color: "black"}}> 
                    Liked Movies 
                </div>
                <div className='movies-picks-entries'>
                    {likedMovies}
                </div>
            </div>
            <div 
                className='disliked-movies' 
                onDragOver={handleDragOver} 
                onDrop={addDislikes}
            >
                <div style={{width: "100%", display: "flex", justifyContent: "center", height: "30px", color: "white"}}>
                     Disiked Movies 
                </div>
                <div className='movies-picks-entries'>
                    {dislikedMovies}
                </div>
            </div>
        </div>
        </>
  );
}

export default Movies;
