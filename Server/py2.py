import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import sys
import json

# Read the movie dataset
df = pd.read_csv("movies.csv")

# Clean the movie titles
df["clean_title"] = df["title"].apply(lambda x: re.sub("[^a-zA-Z0-9 ]", "", x))

# Initialize the TF-IDF vectorizer
vectorizer = TfidfVectorizer(ngram_range=(1, 2))
tfidf = vectorizer.fit_transform(df["clean_title"])

# Read the ratings dataset
ratings = pd.read_csv("ratings.csv")

# Get the title from the command line arguments (for now, using a hardcoded title)
title = sys.argv[1]
#title = "toy story"
title = re.sub("[^a-zA-Z0-9 ]", "", title)

# Transform the user query
user_query = vectorizer.transform([title])
similarity = cosine_similarity(user_query, tfidf).flatten()

# Get the top 5 most similar movies
top_5_indices = np.argpartition(similarity, -5)[-5:]
result = df.iloc[top_5_indices]
results = result[::-1]

# Get the movie ID of the most similar movie
movie_id = results.iloc[0]["movieId"]

# Find users who liked the most similar movie
similar_users = ratings[(ratings["movieId"] == movie_id) & (ratings["rating"] >= 4)]["userId"].unique()

# Get recommendations based on similar users
similar_user_recs = ratings[(ratings["userId"].isin(similar_users)) & (ratings["rating"] >= 4)]["movieId"]
similar_user_recs = similar_user_recs.value_counts() / len(similar_users)  # only top recommendations
similar_user_recs = similar_user_recs[similar_user_recs > 0.1]

# Get recommendations from all users
all_users = ratings[(ratings["movieId"].isin(similar_user_recs.index)) & (ratings["rating"] >= 4)]
all_user_recs = all_users["movieId"].value_counts() / len(all_users["userId"].unique())

# Combine and score recommendations
rec_percentage = pd.concat([similar_user_recs, all_user_recs], axis=1)
rec_percentage.columns = ["similar", "all"]
rec_percentage["score"] = rec_percentage["similar"] / rec_percentage["all"]
rec_percentage = rec_percentage.sort_values("score", ascending=False)

# Get the top 10 recommendations and their details
data = rec_percentage.head(10).merge(df, left_index=True, right_on="movieId")["title"]

# Output the data
titles = data.tolist()

print(json.dumps(titles))

sys.stdout.flush()


