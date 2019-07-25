from django import forms
from bootstrap_datepicker_plus import DatePickerInput
from django.utils.timezone import now
from datetime import datetime, timedelta

def get_start_date():
    return (now() - timedelta(days=90)).strftime("%Y/%m/%d")

def get_end_date():
    return now().strftime("%Y/%m/%d")

class DateForm(forms.Form):
    start = forms.DateField(widget=DatePickerInput(format="%Y/%m/%d"),label="Start date:", required=False, input_formats=["%Y/%m/%d"], initial=get_start_date)
    end = forms.DateField(widget=DatePickerInput(format="%Y/%m/%d"),label="End date:", required=False, input_formats=["%Y/%m/%d"], initial=get_end_date)
