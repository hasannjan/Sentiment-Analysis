import mail
import json
from redis import Redis
import pandas as pd
from pickle import load
import psycopg2
from rake_nltk import Rake
import re
import nltk

redis = Redis(host='3.109.185.48', port=6379, db=0)

MODEL_PATH =  '../modelling/model_svc'
VECTORIZER_PATH = '../modelling/vectorizer'
FEATURE_SELECTION_PATH = '../modelling/feature_selection'

clf = load(open(MODEL_PATH, 'rb'))  # classifier
cv = load(open(VECTORIZER_PATH, 'rb'))  # count vectorizer
fs = load(open(FEATURE_SELECTION_PATH, 'rb'))  # tree based feature selection

def convert_label(label):
    return 'Positive' if label == 1 else 'Negative'

def get_keywords(text):
    cleaned_text = remove_punctuations(text)
    r = Rake(min_length=1,max_length=1)
    r.extract_keywords_from_text(cleaned_text)
    keywords = ','.join(r.get_ranked_phrases())
    return keywords

def remove_punctuations(text):
    tokenizer = nltk.RegexpTokenizer(r"\w+")
    cleaned_text = tokenizer.tokenize(text)
    return " ".join(cleaned_text)

while True:
    data = json.loads(redis.blpop("uploads")[1].decode("utf-8"))
    result = []
    upload_path = "../data/uploads/"
    file_name = data['file_name']
    file_path =  upload_path + file_name
    dataframe = pd.read_csv(file_path, header=None)
    data_vector = cv.transform(dataframe[0]).toarray()
    data_vector_reduced = fs.transform(data_vector)
    predictions = clf.predict(data_vector_reduced)

    for i in range(len(predictions)):
        if predictions[i] == 1:
            predicted_class="Positive"
        else:
            predicted_class ="Negative"

        result.append(
            {
                'text': dataframe[0][i], 
                'prediction': predicted_class,                 
            }
        )
    
    # df = pd.DataFrame(result)
    # df_merged = df.groupby('prediction')['text'].apply(lambda x: ', '.join(x)).reset_index()
    # df_merged['keywords'] = df_merged['text'].apply(lambda x: get_keywords(x))
    # keywords_list = json.loads(df_merged[['keywords','prediction']].to_json(index=False,orient='table'))['data']
    # keywords = {x['prediction']: x['keywords'] for x in keywords_list}
    
    answer = "prediction"
    values = [a_dict[answer] for a_dict in result]
    a=values.count("Positive")
    b=values.count("Negative")
    con = psycopg2.connect(
        host = "3.109.185.48",
        database="postgres",
        user="postgres",
        password="mysecretpassword"
    )
      
    cur = con.cursor()  
    customer_id=str(data["customer_id"])
    request_type="File"
    instance_count=str(len(values))
    positive_comments=str(a)
    negative_comments=str(b)
    status="Successful"
    delivery_method="Email"
    sql="INSERT INTO usage (customer_id,request_type,instance_count,positive_comments,negative_comments,status,delivery_method ) Values ('" + customer_id + "','" + request_type + "','" + instance_count + "','" + positive_comments + "','" + negative_comments + "','" + status + "','" + delivery_method + "')"
    cur.execute(sql)
    con.commit()
    cur.close()
    con.close()

    dataframe = dataframe.merge(pd.DataFrame(predictions), left_index=True, right_index=True, how='inner')
    dataframe.columns = ['Review', 'Prediction']
    dataframe['Prediction'] = dataframe.apply(lambda x: convert_label(x['Prediction']), axis=1)
    dataframe['Keywords'] = dataframe['Review'].apply(lambda x: get_keywords(x))
    result_path = "../data/results/"
    dataframe.to_csv(result_path + file_name , index=False)
    mail.send_email(data['email'], data['file_name']
)
    print('email sent')