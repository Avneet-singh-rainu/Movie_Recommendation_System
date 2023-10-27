import sys
import pandas as pd
import json

column_names = ['movie_id', 'movie_title', 'release_date','video_release_date',
                'IMDb_URL','unknown','Action','Adventure','Animation',
                'Childrens','Comedy','Crime','Documentary','Drama','Fantasy',
                'Film-Noir','Horror','Musical','Mystery','Romance','Sci-Fi',
                'Thriller','War','Western']
df = pd.read_csv('u.item', sep = '|', names = column_names, encoding='latin-1')
df

df.loc[4]['movie_title']

index_movie_dict = {}
for i in range(len(df)):
    index_movie_dict[i] = df.loc[i]['movie_title']
index_movie_dict


movie_index_dict = {}
for i in range(len(df)):
    movie_index_dict[df.loc[i]['movie_title']] = i
movie_index_dict


df = df.drop(['movie_id', 'movie_title', 'release_date','video_release_date','IMDb_URL'], axis = 1)
df

from sklearn.metrics.pairwise import cosine_similarity
similarity_matrix = cosine_similarity(df)
similarity_matrix

similarity_matrix.shape

#movie_name = sys.argv[1:4]
#movie = movie_name[0]+" "+movie_name[1]+" "+"("+movie_name[2]+")"
movie = sys.argv[1]
number_of_recommendations = int(sys.argv[2])
#movie="Babe (1995)"
#number_of_recommendations=5

idx = movie_index_dict[movie]
similarity_list = similarity_matrix[idx]
lst = []
for i in range(len(similarity_list)):
    lst.append((similarity_list[i], i))
lst.sort(reverse = True)
recommendations = []
for i in range(len(lst)):
    recommendations.append(index_movie_dict[lst[i][1]])
recommendations.remove(movie)
final_recommendation_list = recommendations[:number_of_recommendations]

data = final_recommendation_list

resp={
"data": data,
"message": "This is the recommended recommendation for this movie"
}

print(json.dumps(resp))    # print will send  the data to js files

sys.stdout.flush()
