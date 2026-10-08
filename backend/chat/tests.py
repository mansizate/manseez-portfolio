from types import SimpleNamespace
import json
from unittest.mock import patch

from django.test import RequestFactory, SimpleTestCase
from django.urls import resolve, reverse
from rest_framework.test import APIRequestFactory


class ChatApiTests(SimpleTestCase):
    def setUp(self):
        self.api_factory = APIRequestFactory()
        self.request_factory = RequestFactory()

    def post_chat(self, payload):
        request = self.api_factory.post(
            reverse("chat-message"),
            payload,
            format="json",
        )
        return resolve(reverse("chat-message")).func(request)

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_returns_json_reply(self, client_factory):
        client = client_factory.return_value
        client.models.generate_content.return_value = SimpleNamespace(
            text="Mansi is a software engineer."
        )

        response = self.post_chat(
            {
                "message": "Tell me about Mansi",
                "history": [{"role": "user", "content": "Hello"}],
            }
        )
        response.render()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {"reply": "Mansi is a software engineer."},
        )
        self.assertEqual(response["Content-Type"], "application/json")
        client.models.generate_content.assert_called_once()
        client.close.assert_called_once()

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    def test_chat_rejects_invalid_history(self):
        response = self.post_chat({"message": "Hello", "history": "not a list"})

        self.assertEqual(response.status_code, 400)

    @patch("chat.views.GEMINI_API_KEY", "")
    def test_chat_reports_missing_server_key(self):
        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 503)
        self.assertEqual(
            response.data["reply"],
            "The chat service has not been configured yet.",
        )

    def test_root_health_check_supports_get_and_head(self):
        from chat.views import health_check

        response = health_check(self.request_factory.get("/"))
        self.assertEqual(json.loads(response.content), {"status": "ok"})

        head_response = health_check(self.request_factory.head("/"))
        self.assertEqual(head_response.status_code, 200)
