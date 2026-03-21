from idem_key import generate_key
import time

start = 0
key = ''

def get_current_time():
    return time.time()

def initiate_token():
    cur = get_current_time
    if (start == 0):
        # get current time in seconds from epoch, start time for session under this user
        start = time.time()
        key = generate_key
        return (start, key)
    else:

