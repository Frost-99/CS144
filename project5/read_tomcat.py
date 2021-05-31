import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def raed(self):
        postid = random.randint(1, 500)
        self.client.get(f'/editor/post?action=open&username=cs144&postid={postid}', name='/editor/post?action=open')
