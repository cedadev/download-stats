from common.query_builder import QueryBuilder

class UsersQuery(QueryBuilder):
    def __init__(self, filters, analysis_method, after_key):
        self.after_key = after_key
        super().__init__(filters, analysis_method)
    
    def get_size(self):
        return 0

    def update_aggs(self):
        self.grand_totals()
        self.group_by()

    def group_by_main(self):
        self.generated_aggs["group_by"]["aggs"]["country"] = {}
        self.generated_aggs["group_by"]["aggs"]["country"]["terms"] = {}
        self.generated_aggs["group_by"]["aggs"]["country"]["terms"]["field"] = "user_data.isocode.keyword.terms.value"
        self.generated_aggs["group_by"]["aggs"]["field"] = {}
        self.generated_aggs["group_by"]["aggs"]["field"]["terms"] = {}
        self.generated_aggs["group_by"]["aggs"]["field"]["terms"]["field"] = "user_data.field.keyword.terms.value"
        self.generated_aggs["group_by"]["aggs"]["institute_type"] = {}
        self.generated_aggs["group_by"]["aggs"]["institute_type"]["terms"] = {}
        self.generated_aggs["group_by"]["aggs"]["institute_type"]["terms"]["field"] = "user_data.type.keyword.terms.value"

        self.generated_aggs["group_by"]["composite"] = {}
        self.generated_aggs["group_by"]["composite"]["size"] = 10000
        if self.after_key:
            self.generated_aggs["group_by"]["composite"]["after"] = self.after_key
        self.generated_aggs["group_by"]["composite"]["sources"] = []
        self.generated_aggs["group_by"]["composite"]["sources"].append({
            "user": {
                "terms": {
                    "field": "user.keyword.terms.value"
                }
            }
        })
