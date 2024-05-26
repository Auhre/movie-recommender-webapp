import pandas as pd
import json
import pickle

movies = pd.read_csv('lookup/movies.dat', sep='::', header=None, engine='python', encoding='latin-1')
movies = movies.rename(columns={0: 'movie_id_id', 1: 'movie_name', 2: 'movie_genre'})
movies = movies.iloc[:1682]

movies_dict = movies.to_dict('records')
movies_json = json.dumps(movies_dict)

filename = './pickles/movies'
pickle.dump(movies_json, open(filename, 'wb'))
