import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def write(self):
        postid = random.randint(1, 500)
        self.client.post('/api/posts', json={'username': 'cs144', 'password': 'password', 'postid': postid, 'title': 'Hello', 'body': '***World!***'}, cookies=self.cookie, name='/api/posts')

    def on_start(self):
        """on_start is called when a Locust start before any task is scheduled"""
        res = self.client.post("/login", data={"username":"cs144", "password": "password"})
        self.cookie = res.cookies
        if res.status_code != 200:
            print("Failed to authenticate the cs144 user on the server")
            sys.exit();