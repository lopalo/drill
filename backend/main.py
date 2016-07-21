import falcon

class Foo:

    def on_get(self, req, resp):
        resp.body = "Drill App"


def build_app():
    app = falcon.API()
    app.add_route("/foo", Foo())
    return app
