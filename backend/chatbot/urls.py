from django.contrib import admin
from django.urls import include, path
from chat.views import health_check

urlpatterns = [
    path("", health_check, name="health-check"),
    path("admin/", admin.site.urls),
    path("api/chat/", include("chat.urls")),
]
