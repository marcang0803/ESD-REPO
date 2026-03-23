from idem_key import generate_key
import time

class SessionManager:
    def __init__(self):
        self.start_time = 0
        self.id_key = None

    def initiate_token(self):
        # idem_key should expire every 24 hrs
        if self.start_time == 0:
            self.start_time = time.time()
            self.id_key = generate_key()
            return self.start_time, self.id_key
        
        # self.start_time to be labelled as session time
        return self.start_time, self.id_key


