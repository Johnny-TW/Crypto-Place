from django.shortcuts import render
## ------ Rest framework ------
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.decorators import action
# import django_filters.rest_framework
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import BasePermission,IsAdminUser, IsAuthenticatedOrReadOnly, SAFE_METHODS,IsAuthenticated
from rest_framework import permissions
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse,FileResponse
# Create your views here.


class homepage(APIView):
    def get(self, request):
        n = {}
        return render(request, 'index.html', n)
    def post(self, request):
        try:
            data = request.POST.get("table")
            print(data)
            return JsonResponse({'success': True,'data':data})
        except:
            return JsonResponse({'success': False,'msg':'error'})

def get_para(request,name):
    try:
        print(name)
        return JsonResponse({'success': True,'data':name})
    except:
        return JsonResponse({'success': False,'msg':'error'})