import "./About.css"

function About({isOpen, alterMode, onLightMode}) {
    if (isOpen)
        return (
            <div className="modal-overlay">
                <div className="primary"> 
                    <div className="image-container">
                        <img src={'./a2.gif'} alt="neural net" className="neural-net-gif" />
                        <img src={'./a3.gif'} alt="neural net" className="neural-net-gif" />
                        <img src={'./a5.gif'} alt="neural net" className="neural-net-gif" />
                    </div>
                </div>
                <div className="secondary"> 
                    <div className="secondary-header">
                        <div className="secondary-wrapper">
                            <div className='header-text'> About Technology </div>
                            <button className={!onLightMode? "mode-toggle-on-lightmode" :"mode-toggle-on-darkmode"} onClick={alterMode}> {!onLightMode? "Light Mode" : "Dark Mode"} </button>
                        </div>
                        <div className="about-rbm"> 
                            The algorithm behind the process of movie recommendation is RBM (Restricted Boltzmann Machine), a type of Boltzmann Machine.
                            The Boltzmann Machine is a generative unsupervised model that relies on the learning of a probability distribution from a unique 
                            dataset and the use of that distribution to draw conclusions about unexplored data. 
                            The Boltzmann Machine has one or more hidden layers in addition to the input layer, also known as the visible layer or the hidden layer.
                        </div>
                        <div className="about-rbm"> 
                            The restricted term in RBM means that we are not permitted to connect two types of layers that are of the same type to one another. 
                            In other words, the two hidden layers or input layers of neurons are unable to form connections with one another. 
                            However, there may be connections between the apparent and hidden layers.
                            RBM, developed by Geoffrey Hinton, is useful for dimensionality reduction, classification, 
                            regression, collaborative filtering, feature learning and topic modeling but for the sake of this project,
                            RBM is used to perform collaborative filtering for movie recommendation. 
                        </div>
                        <div className="about-rbm"> 
                            Model developed for the movie recommendation can work with just a Jupyter Notebook, but for the sense of user experience, is intergrated into
                            a web app. Using the webapp is simple, just drag the movies you like to the liked movies section and drag the movies
                            you dislike to the disliked movies section and press the recommend button to get movie recommendations as output.
                            Also, please take note that the app will not perform recommendation unless both
                            section (liked and disliked) is populated because the model needs to know what type of movies you dont like in order 
                            to avoid suggesting movies you would possibly dislike. Enjoy the app!
                        </div>
                        <div className="about-rbm"> 
                            And OH!, by the way, for convenience, feel free to toggle the button at the upper right corner, if you prefer some dark theme mode vibe on the site or maybe 
                            some light mode theme vibe, UP TO YOU!
                        </div>
                        <div className="about-creator-wrapper">
                            <div className="about-creator"> App Created by: Rey Rico Alzaga</div>
                            <div className="about-creator"> 
                                <a className="creator-link" href="https://github.com/Auhre" target="_blank" rel="noreferrer">Github</a>  
                                <a className="creator-link" href="https://www.linkedin.com/in/rey-rico-alzaga/" target="_blank" rel="noreferrer">LinkedIn</a> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    else return null
}

export default About