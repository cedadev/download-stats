from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.views.generic import TemplateView

class IndexView(TemplateView):
    template_name = "index.html"
    
    def get(self, request):
        
        return render(request, self.template_name, {})