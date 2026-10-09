from types import SimpleNamespace
import json
from unittest.mock import patch

import httpx
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
            {"success": True, "reply": "Mansi is a software engineer."},
        )
        self.assertEqual(response["Content-Type"], "application/json")
        client.models.generate_content.assert_called_once()
        self.assertEqual(
            client.models.generate_content.call_args.kwargs["config"]
            .thinking_config.thinking_level.value,
            "MINIMAL",
        )
        self.assertEqual(
            client_factory.call_args.kwargs["http_options"].timeout,
            27000,
        )
        self.assertEqual(
            client_factory.call_args.kwargs["http_options"]
            .retry_options.attempts,
            1,
        )
        client.close.assert_called_once()

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    def test_chat_rejects_invalid_history(self):
        response = self.post_chat({"message": "Hello", "history": "not a list"})

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data["success"])
        self.assertIn("error", response.data)

    def test_chat_rejects_non_string_history_role(self):
        response = self.post_chat(
            {
                "message": "Hello",
                "history": [{"role": ["user"], "content": "Hi"}],
            }
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["code"], "invalid_history")

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    def test_chat_rejects_empty_message(self):
        response = self.post_chat({"message": "  ", "history": []})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Please type a message.")
        self.assertEqual(response.data["code"], "invalid_message")

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_maps_invalid_api_key_to_configuration_error(self, client_factory):
        error = RuntimeError("API_KEY_INVALID: API key not valid")
        error.code = 400
        client_factory.return_value.models.generate_content.side_effect = error

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.data["code"], "invalid_api_key")
        self.assertFalse(response.data["success"])
        self.assertNotIn("test-key", str(response.data))

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_maps_unavailable_model(self, client_factory):
        error = RuntimeError("model not found")
        error.code = 404
        client_factory.return_value.models.generate_content.side_effect = error

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.data["code"], "model_unavailable")

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_reports_provider_request_error(self, client_factory):
        error = RuntimeError("invalid request")
        error.code = 400
        client_factory.return_value.models.generate_content.side_effect = error

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 502)
        self.assertFalse(response.data["success"])
        self.assertEqual(response.data["code"], "provider_request_error")

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_returns_structured_timeout_error(self, client_factory):
        client_factory.return_value.models.generate_content.side_effect = (
            httpx.ReadTimeout("provider timeout")
        )

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 504)
        self.assertFalse(response.data["success"])
        self.assertEqual(
            response.data["error"],
            "The response is taking too long. Please try again.",
        )

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_returns_rate_limit_error(self, client_factory):
        error = RuntimeError("rate limit")
        error.code = 429
        client_factory.return_value.models.generate_content.side_effect = error

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 429)
        self.assertFalse(response.data["success"])
        self.assertIn("temporarily busy", response.data["error"])

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_reports_invalid_provider_key(self, client_factory):
        error = RuntimeError("API key not valid")
        error.code = 400
        client_factory.return_value.models.generate_content.side_effect = error

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.data["success"])
        self.assertIn("not configured correctly", response.data["error"])

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_reports_unavailable_model(self, client_factory):
        error = RuntimeError("model not found")
        error.code = 404
        client_factory.return_value.models.generate_content.side_effect = error

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.data["success"])
        self.assertIn("model is unavailable", response.data["error"])

    @patch("chat.views.GEMINI_API_KEY", "test-key")
    @patch("chat.views.genai.Client")
    def test_chat_rejects_empty_provider_response(self, client_factory):
        client_factory.return_value.models.generate_content.return_value = (
            SimpleNamespace(text=None)
        )

        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 502)
        self.assertFalse(response.data["success"])
        self.assertIn("empty response", response.data["error"])

    @patch("chat.views.GEMINI_API_KEY", "")
    def test_chat_reports_missing_server_key(self):
        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.data["success"])
        self.assertEqual(
            response.data["error"],
            "The chat service is not configured. Please contact the site owner.",
        )
        self.assertEqual(response.data["code"], "missing_api_key")

    @patch("chat.views.GEMINI_API_KEY", "your-new-gemini-key")
    @patch("chat.views.genai.Client")
    def test_chat_rejects_placeholder_server_key_without_provider_call(
        self,
        client_factory,
    ):
        response = self.post_chat({"message": "Hello", "history": []})

        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.data["success"])
        self.assertEqual(response.data["code"], "missing_api_key")
        client_factory.assert_not_called()

    @patch("chat.views.drf_exception_handler", return_value=None)
    def test_unexpected_api_exception_returns_json_500(self, exception_handler):
        from chat.views import chat_api_exception_handler

        error = RuntimeError("unexpected failure")
        with self.assertLogs("chat.views", level="ERROR"):
            response = chat_api_exception_handler(error, {})

        self.assertEqual(response.status_code, 500)
        self.assertEqual(
            response.data,
            {
                "success": False,
                "error": (
                    "The chat service encountered an unexpected error. "
                    "Please try again."
                ),
                "code": "internal_error",
            },
        )
        exception_handler.assert_called_once_with(error, {})

    def test_malformed_json_returns_structured_error(self):
        request = self.api_factory.post(
            reverse("chat-message"),
            "{",
            content_type="application/json",
        )
        response = resolve(reverse("chat-message")).func(request)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data["success"])
        self.assertIn("error", response.data)

    def test_root_health_check_supports_get_and_head(self):
        from chat.views import health_check

        response = health_check(self.request_factory.get("/"))
        self.assertEqual(json.loads(response.content), {"status": "ok"})

        head_response = health_check(self.request_factory.head("/"))
        self.assertEqual(head_response.status_code, 200)
