import requests
import json

# 1. Replace this with your actual OutSystems API URL
outsystems_url = "https://personal-rx8tuqla.outsystemscloud.com/Notifications_Microservice/rest/InternalNotificationAPI/TriggerPayoutEmail"

# 2. The exact JSON payload your API expects
# IMPORTANT: Put your actual personal email address here so you can verify it arrives!
test_payload = {
    "ProviderEmail": "javierspx3112@gmail.com", 
    "PayoutAmount": 150.50,
    "Status": "SUCCESS"
}

print("Firing test request to OutSystems...")

try:
    # 3. Send the POST request
    response = requests.post(outsystems_url, json=test_payload)
    
    # 4. Print the results
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200 or response.status_code == 204:
        print("✅ Success! Check your inbox.")
    else:
        print("❌ Something went wrong.")
        print(f"Response: {response.text}")

except Exception as e:
    print(f"Connection failed: {e}")