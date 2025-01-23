import ast
import sys
import json
from typing import Any, Dict
from pythainlp.tokenize import word_tokenize
from fastapi import Body, FastAPI, Request

from sentence_transformers import SentenceTransformer

# Load pre-trained model
st_model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

def my_function(textinp):
    # text = "บ้านเล็กในป่าใหญ่ เป็นหนังสือละมุนหัวใจ เรื่องราวของของครอบครัวอิงกัลล์ส ท่ามกลางป่ากว้างในกระท่อมไม้ซุงหลังน้อยอันแสนสุขใน “บ้านเล็กในป่าใหญ่”"
    tokens = word_tokenize(textinp)
    print(tokens)
    return tokens

def embedded(textinp):
    st_embeddings = st_model.encode(textinp)
    print("it's done", st_embeddings)
    return st_embeddings.tolist()
# if __name__ == '__main__':
    # Parse input from the command line
    # try:
    #     input_data = json.loads(sys.argv[1])
    #     textinp = input_data['textinp']
    #     # y = input_data['y']
    #     result = my_function(textinp)
    #     print(json.dumps({'result': result}))  # Output result as JSON
    # except json.JSONDecodeError as e:
    #     # print(f"Error parsing JSON: {e}")
    #     print(e)



app = FastAPI()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("tokenizer:app", host="127.0.0.1", port=8000, reload=True)


@app.post("/tokenize")
async def token(payload: Any = Body(None)):
    try:
        print('req', payload)
        # body = await request.json()
        body = ast.literal_eval(payload.decode('utf-8'))
        print('body', body)
        result = my_function(body['textinp'])
        return {"result": result}
    except Exception as e:
        print(e)

@app.post("/embedding")
async def token(payload: Any = Body(None)):
    try:
        print('req', payload)
        # body = await request.json()
        body = ast.literal_eval(payload.decode('utf-8'))
        print('body', body)
        result = embedded(body['textinp'])
        return {"result": result}
    except Exception as e:
        print(e)

