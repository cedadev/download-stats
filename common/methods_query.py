from common.query_builder import QueryBuilder

class MethodsQuery(QueryBuilder):
    def get_size(self):
        return NotImplementedError

    def update_aggs(self):
        return NotImplementedError