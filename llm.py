import os
from dotenv import load_dotenv
from openai import OpenAI
from perf_helper import timer


load_dotenv()

OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL")

# OLLAMA
openai_client = OpenAI(
    api_key=OLLAMA_API_KEY,
    base_url=OLLAMA_BASE_URL,
)

# Small Models for testing
# model = "qwen3:1.7b" # local testing; MB Air integrated GPUs w/ latency ~1 min.
model = "gpt-oss:20b" # remote testing; Cheap and general purpose remote model. ~2.6 sec latency

# Text summarization
# model = "qwen3:8b" 
# model = "gemma4:12b"  # Replace with the desired model name

# Dedicated OCR
# model = "deepseek-ocr"
# model = "glm-ocr"

if __name__ == "__main__":
    # This works but is slow b/c of some Gemini system wide issue.
    with timer("OpenAI API Test"):
        # Example usage of the OpenAI client
        print("OpenAI API BASE URL: ", OLLAMA_BASE_URL)
        print("Using model: ", model)
        print("Making a test request ...")
        response = openai_client.chat.completions.create(
            model=model,
            reasoning_effort="none",
            max_tokens=300,
            messages=[
                # In the system role, you can provide instructions or context for the model.
                {
                    "role": "system",
                    "content": """
                        Please provide accurate and concise answers to legal questions.
                        If the answer is not found in the context, respond with "I don't know.
                    """
                },
                # In the user role, you can provide the user's input or question.
                {"role": "user", "content": "Give me a brief checklist of documents I should put together for estate planning."}
                # In the assistant role, you can provide the model's previous responses to enrich the context
                # or provide a completed example of how you'd like your output.
                # {"role": "assistant", "content": "Here is a brief checklist of documents you should consider for estate planning."}
            ]
        )
        print("Response: ", response.choices[0].message.content)
