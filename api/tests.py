from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Note


class NoteModelTest(TestCase):
    def test_create_note(self):
        note = Note.objects.create(body="Test Note Body")
        self.assertEqual(note.body, "Test Note Body")
        self.assertIsNotNone(note.created)
        self.assertIsNotNone(note.updated)
        self.assertEqual(str(note), "Test Note Body")

    def test_str_with_empty_or_long_body(self):
        empty_note = Note.objects.create(body=None)
        self.assertEqual(str(empty_note), "")

        long_text = "A" * 100
        long_note = Note.objects.create(body=long_text)
        self.assertEqual(str(long_note), "A" * 69)


class NoteAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.note1 = Note.objects.create(body="First Note")
        self.note2 = Note.objects.create(body="Second Note")

    def test_get_routes(self):
        response = self.client.get(reverse('routes'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertTrue(len(response.data) > 0)

    def test_get_notes(self):
        response = self.client.get(reverse('notes'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # Order should be -created (note2 created after note1)
        self.assertEqual(response.data[0]['id'], self.note2.id)

    def test_get_note_success(self):
        response = self.client.get(reverse('note', args=[self.note1.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['body'], "First Note")

    def test_get_note_not_found(self):
        response = self.client.get(reverse('note', args=[99999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_note(self):
        payload = {'body': 'A brand new note created via API'}
        response = self.client.post(reverse('create-note'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['body'], payload['body'])
        self.assertTrue(Note.objects.filter(body=payload['body']).exists())

    def test_update_note_success(self):
        payload = {'body': 'Updated note body'}
        response = self.client.put(reverse('update-note', args=[self.note1.id]), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.note1.refresh_from_db()
        self.assertEqual(self.note1.body, 'Updated note body')

    def test_update_note_not_found(self):
        payload = {'body': 'Nonexistent'}
        response = self.client.put(reverse('update-note', args=[99999]), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_note_success(self):
        response = self.client.delete(reverse('delete-note', args=[self.note1.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Note.objects.filter(id=self.note1.id).exists())

    def test_delete_note_not_found(self):
        response = self.client.delete(reverse('delete-note', args=[99999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
