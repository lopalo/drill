import json

def json_response(req, resp, resource):
    resp.body = json.dumps(resp.body)
