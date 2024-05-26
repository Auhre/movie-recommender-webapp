import numpy as np
import pandas as pd
import torch
import torch.nn.parallel
import torch.utils.data
import pickle
import json
import sys

movies = pd.read_csv('lookup/movies.dat', sep='::', header=None, engine='python', encoding='latin-1')
users = pd.read_csv('lookup/users.dat', sep='::', header=None, engine='python', encoding='latin-1')
ratings = pd.read_csv('lookup/ratings.dat', sep='::', header=None, engine='python', encoding='latin-1')

ratings = ratings.rename(columns={0: 'user_id', 1: 'movie_id', 2: 'movie_rating', 3: 'time_stamp'})
movies = movies.rename(columns={0: 'movie_id_id', 1: 'movie_name', 2: 'movie_genre'})
users = users.rename(columns={0: 'user_id', 1: 'user_gender', 2: 'user_age', 3: 'user_job_code', 4: 'user_zip_code'})

training_set = pd.read_csv('data/u1.base', delimiter='\t', header=None)
training_set = np.array(training_set, dtype='int')
test_set = pd.read_csv('data/u1.test', delimiter='\t', header=None)
test_set = np.array(test_set, dtype='int')

nb_users = int(max(max(training_set[:, 0], ), max(test_set[:, 0])))
nb_movies = int(max(max(training_set[:, 1], ), max(test_set[:, 1])))


class RBM():
    def __init__(self, num_vis, num_hid):
        self.W = torch.randn(num_hid, num_vis)
        self.a = torch.randn(1, num_hid)
        self.b = torch.randn(1, num_vis)
    def sample_h(self, x):
        weight_x = torch.mm(x, self.W.t())
        activation = weight_x + self.a.expand_as(weight_x)
        prob_hid_given_vis = torch.sigmoid(activation)
        return prob_hid_given_vis, torch.bernoulli(prob_hid_given_vis)
    def sample_v(self, y):
        weight_y = torch.mm(y, self.W)
        activation = weight_y + self.b.expand_as(weight_y)
        prob_vis_given_hid = torch.sigmoid(activation)
        return prob_vis_given_hid, torch.bernoulli(prob_vis_given_hid)
    def train(self, vis, vis_k, prob_hid, prob_hid_k):
        self.W += (torch.mm(vis.t(), prob_hid) - torch.mm(vis_k.t(), prob_hid_k)).t()
        self.b += torch.sum((vis-vis_k), 0)
        self.a += torch.sum((prob_hid-prob_hid_k), 0)

def new_user_rating_populate(liked_movies, disliked_movies):
    ratings_temp = np.full((nb_movies), -1.0)
    for r in liked_movies:
        ratings_temp[r] = 1.0
    for d in disliked_movies:
        ratings_temp[d] = 0.0
    return ratings_temp


def nonexisting_user_movie_recommend(liked_movies, disliked_movies, rbm):
    movies_list = movies['movie_name']
    bad_recommendation = []
    good_recommendation = []
    good_recommendation_id = []
    bad_recommendation_id = []

    ratingslist = new_user_rating_populate(liked_movies, disliked_movies)
    ratingslist = torch.FloatTensor(np.array(ratingslist))
    ratingslist = torch.unsqueeze(ratingslist, 0)
    _,hid = rbm.sample_h(ratingslist)
    _,res = rbm.sample_v(hid)

    for id_movie in range(nb_movies):
        movie = movies_list[id_movie]
        idx = movies.loc[movies['movie_name'] == movie, 'movie_id_id'].iloc[0]
        if ratingslist[0][id_movie] < 0.0:
            if res[0][id_movie] == 1:
                good_recommendation.append(movie)
                good_recommendation_id.append(idx)
            else:
                bad_recommendation.append(movie)
                bad_recommendation_id.append(idx)

    return np.array(good_recommendation), np.array(bad_recommendation), np.array(good_recommendation_id), np.array(bad_recommendation_id)

def arg_claim(sys_arg):
    arg = sys_arg
    arr = [int(n) for n in arg.split(",")]
    return arr

liked = arg_claim(sys.argv[1])
disliked = arg_claim(sys.argv[2])

filename = './pickles/rbm-recommender'
rbm = pickle.load(open(filename, 'rb'))

good_reco, bad_reco, good_id, bad_id = nonexisting_user_movie_recommend(liked, disliked, rbm)
recommendations = pd.DataFrame({'movie_id_id':good_id, 'movie_name': good_reco})

print(recommendations)

recommendations_dict = recommendations.to_dict('records')
recommendations_json = json.dumps(recommendations_dict)

filename = './pickles/recommendations'
pickle.dump(recommendations_json, open(filename, 'wb'))

