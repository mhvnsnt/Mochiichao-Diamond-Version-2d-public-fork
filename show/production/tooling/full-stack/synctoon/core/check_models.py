import google.generativeai as genai
import os

# It's recommended to set the API key as an environment variable for security
# However, for this check, we'll use the one from the core script.
GOOGLE_API_KEY = ""

genai.configure(api_key=GOOGLE_API_KEY)

print("Available models for generateContent:")
for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        print(m.name)
