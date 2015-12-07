from locust import HttpLocust, TaskSet, task

class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.login()

    def login(self):
        self.client.post("/login", {"username":"ajain", "password":"pwd"})

    @task(2)
    def index(self):
        self.client.get("/caterers")

    @task(1)
    def getorders2(self):
        self.client.post("/getOrders", {"status": "1", "catererid": "5664cbb5a4bdb69c3b3db06e"})

    @task(3)
    def getorders1(self):
        self.client.post("/getOrders", {"status": "2", "catererid": "5664cbb5a4bdb69c3b3db06e"})

    @task(4)
    def signup(self):
        self.client.get("/signup")

    @task(5)
    def editCaterer(self):
        self.client.get("/editCaterer")

    @task(6)
    def catererDashboard(self):
        self.client.get("/catererDashboard")

    @task(7)
    def order(self):
        self.client.get("/order")

    @task(8)
    def editUser(self):
        self.client.get("/editUser")

    @task(9)
    def caterers(self):
        self.client.get("/caterers")

    @task(10)
    def catererDisplay(self):
        self.client.get("/catererDisplay")

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=5000
    max_wait=9000
