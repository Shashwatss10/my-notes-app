from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import NoteSerializer
from .models import Note


@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/notes/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of notes'
        },
        {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/notes/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/update/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Updates an existing note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes an existing note'
        },
    ]
    return Response(routes)


@api_view(['GET'])
def getNotes(request):
    notes = Note.objects.all().order_by('-created')
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getNote(request, pk):
    try:
        note = Note.objects.get(id=pk)
        serializer = NoteSerializer(note, many=False)
        return Response(serializer.data)
    except Note.DoesNotExist:
        return Response({'detail': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def updateNote(request, pk):
    try:
        note = Note.objects.get(id=pk)
    except Note.DoesNotExist:
        return Response({'detail': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = NoteSerializer(instance=note, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteNote(request, pk):
    try:
        note = Note.objects.get(id=pk)
        note.delete()
        return Response('Note was deleted!')
    except Note.DoesNotExist:
        return Response({'detail': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def createNote(request):
    data = request.data
    body = data.get('body', '') if isinstance(data, dict) else ''
    note = Note.objects.create(body=body)
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)
