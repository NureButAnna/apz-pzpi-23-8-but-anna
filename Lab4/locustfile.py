from locust import HttpUser, task, between
import random

WASTE_TYPES = ["plastic", "glass", "paper", "metal"]
SITE_IDS = [1, 2, 3]


class EcofyUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        self.token = None
        r = self.client.post("/auth/login",
                             data={"username": "user@ecofy.ua",
                                   "password": "testpass123"},
                             name="/auth/login")
        if r.status_code == 200:
            self.token = r.json().get("access_token")

    def h(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    @task(4)
    def get_container_sites(self):
        self.client.get("/container-sites/", headers=self.h(),
                        name="/container-sites/")

    @task(3)
    def get_containers_by_site(self):
        self.client.get(f"/container-sites/{random.choice(SITE_IDS)}/containers",
                        headers=self.h(), name="/container-sites/{id}/containers")

    @task(2)
    def get_tips(self):
        self.client.get("/tips/", name="/tips/")
