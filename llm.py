import os
from dotenv import load_dotenv
from openai import OpenAI
from perf_helper import timer


load_dotenv()

# CHATGPT
# openai_client = OpenAI(
#     api_key=os.getenv("GEMINI_API_KEY"),
# )

# model = "gpt-5.4-mini"  # Replace with the desired model name

# GEMINI
openai_client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)
model = "gemini-3.8-flash"

if __name__ == "__main__":
    # This works but is slow b/c of some Gemini system wide issue.
    with timer("OpenAI API Test"):
        # Example usage of the OpenAI client
        print("Using model:", model)
        print("Making a test request to the OpenAI API...")
        response = openai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello! Can you help me with a question?"}
            ]
        )
        print("Response: ", response.choices[0].message.content)
