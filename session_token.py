from idem_key import generate_key
import time

class SessionManager:
    def __init__(self):
        self.start_time = 0
        self.id_key = None
        self.EXPIRY_DURATION = 86400 # 24 hours in seconds

    def initiate_token(self):
        # idem_key should expire every 24 hrs
        current_time = time.time()

        if self.start_time == 0 or (current_time - self.start_time) > self.EXPIRY_DURATION:
            self.start_time = current_time
            self.id_key = generate_key()
            return self.start_time, self.id_key
        
        # self.start_time to be labelled as session time
        return self.start_time, self.id_key


