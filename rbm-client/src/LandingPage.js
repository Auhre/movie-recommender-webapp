import { useEffect, useState } from 'react';
import axios from "axios";
import './LandingPage.css'

function LandingPage ({isOpen}) {

    const [moviesList, setMoviesList] = useState([])
    const [recommendationsList, setRecommendationsList] = useState([])
    const [loadingRecommendation, setLoadingRecommendation] = useState(false)
    const [loadedMovieList, setLoadedMovieList] = useState(false)
    const [apiFetching, setApiFetching] = useState(false)
    const [currMovieId, setcurrMovieId] = useState()
    const [likes, setLikes] = useState([])
    const [dislikes, setDislikes] = useState([])
    const [recommends, setRecommends] = useState([])

    async function fetchMovies() {
        let res = await axios(`http://localhost:8080/movies`)
        let movies = res.data
        setMoviesList(movies)
        setLoadedMovieList(true)
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
            return "liked"
        }
        else if (dislikes.some(id => id === idx)) {
            return "disliked"
        }
        else if (recommends.some(id => id === idx)) {
            return "recommends"
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
    }, [likes, dislikes, apiFetching, loadedMovieList])

    useEffect(() => {
        const timeout = setTimeout(() => {
        }, 3000)

        async function fetchRecommendations() {
            let res = await axios(`http://localhost:8080/recommendations`)
            let recommendations = res.data
            setRecommendationsList(recommendations)
            if(recommendations.length === 0) {
                await fetchRecommendations()
            }
            setLoadingRecommendation(false)
        }

        if(loadingRecommendation && !apiFetching) {
            console.log("Fetching recommendation data")
            setApiFetching(true)
            fetchRecommendations()
        }

        return () => {
            clearTimeout(timeout)
        }
    }, [loadingRecommendation, recommendationsList, apiFetching])

    useEffect(() => {
        async function populateRecommends(){
            let recommendData = recommendationsList.map(data => data.movie_id_id)
            setRecommends(recommendData)
            }

            if(recommendationsList.length !== 0) {
                populateRecommends()
                setApiFetching(false)
                console.log("Loaded the recommendation data")
            }
    }, [recommendationsList])
    
    const movies = moviesList.map(data => {
        if(data.movie_name === "dummy") return null
        return <button 
                    key={data.movie_id_id} 
                    className={`draggable-${colorMovie(data.movie_id_id)}`} 
                    draggable="true" 
                    onDragStart={() => {setcurrMovieId(data.movie_id_id)}}
                >
                    {data.movie_name}
                </button>
    })

    const likedMovies = likes.map(id => {
        return <button 
                    key={id} 
                    className={`draggable-${colorMovie(id)}`} 
                    onClick={() => {setLikes(likes.filter(item => item !== id))}}
                >
                    {moviesList[id-1].movie_name}
                </button>
    })

    const dislikedMovies = dislikes.map(id => {
        return <button 
                    key={id} 
                    className={`draggable-${colorMovie(id)}`} 
                    onClick={() => {setDislikes(dislikes.filter(item => item !== id))}}
                >
                    {moviesList[id-1].movie_name}
                </button>
    })

    const recommendationMovies = recommendationsList.map(data => {
        return <button 
                    disabled={true}
                    key={data.movie_name} 
                    className={'draggable-recommended'} 
                >
                    {data.movie_name}
                </button>
    })

    function recommendNow() {
        if(likes.length === 0 || dislikes.length === 0) return
        setRecommends([])
        setLoadingRecommendation(true)
        const origLikesId = likes.map(num => num-1)
        const origDislikesId = dislikes.map(num => num-1)
        const reqData = {
            liked: origLikesId,
            disliked: origDislikesId
        }
        axios.post(`http://localhost:8080/recommend-request`, reqData)
    }


    return (
        <>
        <div className={isOpen? 'landing-container-modal':'landing-container'}>
            <div className='movies-list'>
                <div className='block-text'> Movies </div>
                <div className='section-container'> 
                {
                    !loadedMovieList? 
                    <div className='loading-container '>
                        <img src={'./loading-icon-neat.png'} alt="loading icon"  className='loading-icon'/>
                    </div> 
                    :
                    movies
                } 
            </div>
            </div>
            <div className='liked-movies-list'>
                <div className='block-text'> Liked </div>
                <div className='section-container' onDragOver={handleDragOver} 
                onDrop={addLikes}> {likedMovies} </div>
            </div>
            <div className='disliked-movies-list'>
                <div className='block-text'> Disliked </div>
                <div className='section-container' onDragOver={handleDragOver} 
                onDrop={addDislikes}> {dislikedMovies} </div>
            </div>
            <div className={loadingRecommendation? 'recommend-button-disabled' : 'recommend-button'} onClick={recommendNow}>
                <div className='section-container'>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>R</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>E</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>C</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>O</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>M</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>M</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>E</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>N</p>
                    <p className={loadingRecommendation? 'separated-text-running' : 'separated-text'}>D</p>
                </div>
            </div>
            <div className='recommended-movies-list'>
                <div className='block-text'> Recommendations </div>
                <div className='section-container'> 
                {
                    apiFetching? 
                    <div className='loading-container '>
                        <img src={'./loading-icon-neat.png'} alt="loading icon"  className='loading-icon'/>
                    </div> 
                    :
                    recommendationMovies
                } 
                </div>
            </div>
        </div>
        </>
    )
}

export default LandingPage