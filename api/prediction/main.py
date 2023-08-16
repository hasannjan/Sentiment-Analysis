from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, Form
from pickle import load
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from redis import Redis
import json
import psycopg2
from rake_nltk import Rake
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import pandas as pd
nltk.download('stopwords')

app = FastAPI()
redis = Redis(host='3.109.185.48', port=6379, db=0)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Items(BaseModel):
    items: list = []
    customer_id: str      
     
class Prediction(BaseModel):
    text: str
    prediction: str    

class Predictions(BaseModel):
    predictions: List[Prediction] 


MODEL_PATH =  '../../modelling/model_svc'
VECTORIZER_PATH = '../../modelling/vectorizer'
FEATURE_SELECTION_PATH = '../../modelling/feature_selection'


clf = load(open(MODEL_PATH, "rb"))  # classifier
cv = load(open(VECTORIZER_PATH, "rb"))  # count vectorizer
fs = load(open(FEATURE_SELECTION_PATH, "rb"))  # tree based feature selection


@app.get("/")
def read_root():
    return 'Welcome To Prediction Server'


@app.post("/predict")
async def read_item(items: Items):
    result = []
    data = items.dict()
    data_vector = cv.transform(data['items']).toarray()
    data_vector_reduced = fs.transform(data_vector)
    predictions = clf.predict(data_vector_reduced)

    for i in range(len(predictions)):
        if predictions[i] == 1:
            predicted_class="Positive"
        else:
            predicted_class ="Negative"

        result.append(
            {
                'text': data['items'][i], 
                'prediction': predicted_class,                 
            }
        )
    
    df = pd.DataFrame(result)
    df_merged = df.groupby('prediction')['text'].apply(lambda x: ', '.join(x)).reset_index()
    df_merged['keywords'] = df_merged['text'].apply(lambda x: get_keywords(x))
    keywords_list = json.loads(df_merged[['keywords','prediction']].to_json(index=False,orient='table'))['data']
    keywords = {x['prediction']: x['keywords'] for x in keywords_list}
    
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
    customer_id=data["customer_id"]
    request_type="API"
    instance_count=str(len(values))
    positive_comments=str(a)
    negative_comments=str(b)
    status="Successful"
    delivery_method="Real Time"
    sql="INSERT INTO usage (customer_id,request_type,instance_count,positive_comments,negative_comments,status,delivery_method ) Values ('" + customer_id + "','" + request_type + "','" + instance_count + "','" + positive_comments + "','" + negative_comments + "','" + status + "','" + delivery_method + "')"
    print(sql)
    cur.execute(sql)
    con.commit()
    cur.close
    con.close()
    return {'predictions': result, 'keywords': keywords}


@app.post("/upload")
async def create_upload_file(file: UploadFile = File(...), email: str = Form(...), customer_id: int = Form(...)):
    contents = await file.read()
    path = f'../../data/uploads/{file.filename}'
    with open(path, 'wb') as f:
        f.write(contents)
        redis.lpush('uploads', json.dumps({"email": email, "file_name": file.filename, "customer_id": customer_id}))
        
    return {"filename": file.filename}


# @app.post("/model/{model_id}")
# async def switch_model(model_id: int):
#     global clf
#     if model_id == 1:
#         clf = load(open('../../modelling/model_svc', 'rb'))
#     if model_id == 2:
#         clf = load(open('../../modelling/model_nvb', 'rb'))
#     return {"response": "success", "new_id": model_id}

def get_keywords(text):
    cleaned_text = remove_punctuations(text)
    r = Rake(min_length=1,max_length=3)
    r.extract_keywords_from_text(cleaned_text)
    return r.get_ranked_phrases()

def remove_punctuations(text):
    tokenizer = nltk.RegexpTokenizer(r"\w+")
    cleaned_text = tokenizer.tokenize(text)
    return " ".join(cleaned_text)