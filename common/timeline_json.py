from common.json_maker import JsonMaker

class TimelineJson(JsonMaker):
    def get_title(self):
        return NotImplementedError

    def _populate_json(self, json):
        return NotImplementedError