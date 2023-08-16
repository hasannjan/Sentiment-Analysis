# Requirements to run this project
Match the versions below
Node 10.13.0
pandas
uvicorn
fastapi
psycopg2
nltk
redis
scikit-learn==0.21.3
rake-nltk
numpy
python-multipart

# To run the project
Open 4 windows in Anaconda Powershell
1) cd sentiment-analysis\API\prediction
   uvicorn main:app  --reload --port 8000
2) cd sentiment-analysis\API\auth
   uvicorn main:app  --reload --port 8001
3) cd sentiment-analysis\worker
   uvicorn main:app  --reload --port 8002
4) cd sentiment-analysis\client
   npm run start

