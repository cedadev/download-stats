import bitmath

from common.file_response import FileResponse
from common.json_maker_factory import JsonMakerFactory


class DepositsDatasetResponse(FileResponse):
    def get_json(self):
        return JsonMakerFactory(deposits=True).get(self.filters, self.analysis_method).json()

    def get_view(self):
        return "deposits"

    def get_headings(self):
        return ["Dataset", "Size", "Deposits", "Directories", "Symlinks", "Removed directories", "Removed files"]

    def _write_xlsx(self, json_data, worksheet, date_format):
        worksheet.set_column(0, 0, 74)
        worksheet.set_column(1, 6, 12)
        for number, heading in enumerate(self.get_headings()):
            worksheet.write_string(0, number, heading)
        for row, result in enumerate(json_data["results"], start = 1):
            worksheet.write_string(row, 0, result)
            size = bitmath.parse_string(f'{str(json_data["results"][result]["size"])}B').best_prefix(bitmath.NIST).format("{value:.1f} {unit}")
            worksheet.write_string(row, 1, size)
            worksheet.write_number(row, 2, json_data["results"][result]["deposits"])
            worksheet.write_number(row, 3, json_data["results"][result]["mkdir"])
            worksheet.write_number(row, 4, json_data["results"][result]["symlink"])
            worksheet.write_number(row, 5, json_data["results"][result]["rmdir"])
            worksheet.write_number(row, 6, json_data["results"][result]["remove"])
