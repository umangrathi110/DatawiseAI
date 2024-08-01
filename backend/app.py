from flask import Flask, request, jsonify
from langchain_openai import ChatOpenAI
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Load environment variables and initialize models
load_dotenv()
pinecone_apikey = os.getenv("PINECONE_API_KEY")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME", "newfinancedata")

pinecone = Pinecone(api_key=pinecone_apikey, index=pinecone_index_name)
embeddings = OpenAIEmbeddings()

vector_store = PineconeVectorStore(index_name=pinecone_index_name, embedding=embeddings, text_key="text")
prompt_template = PromptTemplate(
    template="""
    You are a financial assistant. Your task is to answer the user's query using the provided information.

    Query:
    {query}

    Information:
    {information}

    Steps to follow:
    1. Carefully read and understand the user's query.
    2. Use only the provided context to find the most relevant and accurate information.
    3. Ensure your response is concise, informative, and engaging, tailored to the user's query.
    4. Maintain relevance and enhance the user's understanding or provide actionable advice.
    5. Use a professional and helpful tone.
    """,
    input_variables=["query", "information"]
)
model = ChatOpenAI(temperature=0, model_name="gpt-4o-mini")

@app.route('/search', methods=['POST'])
def search():
    # Get query from request
    query = request.json.get('query', '')
    if not query:
        return jsonify({"error": "Query is required"}), 400

    # Perform similarity search
    similarity_search_results = vector_store.similarity_search(query=query, k=5)
    
    # Extract text content and metadata (filenames)
    information = "\n".join([doc.page_content for doc in similarity_search_results])
    filenames = [doc.metadata.get("filename", "unknown") for doc in similarity_search_results]

    # Generate response using the language model
    response = generate_response(prompt_template, query, information, model)

    return jsonify({"response": response.content, "filenames": filenames})

def generate_response(prompt_template, query, information, model):
    """Generate a response using the provided prompt template and model."""
    chain = prompt_template | model
    return chain.invoke({"query": query, "information": information})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
