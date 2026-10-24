import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'

const NotePage = () => {
    let { id } = useParams()
    let navigate = useNavigate()
    let [note, setNote] = useState({ body: '' })

    useEffect(() => {
        let getNote = async () => {
            if (id === 'new') return
            try {
                let response = await fetch(`/api/notes/${id}/`)
                if (response.ok) {
                    let data = await response.json()
                    setNote(data)
                }
            } catch (err) {
                console.error('Failed to load note', err)
            }
        }
        getNote()
    }, [id])

    let createNote = async () => {
        if (!note.body || !note.body.trim()) return
        await fetch(`/api/notes/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...note, 'updated': new Date() })
        })
    }

    let updateNote = async () => {
        await fetch(`/api/notes/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...note, 'updated': new Date() })
        })
    }

    let deleteNote = async () => {
        await fetch(`/api/notes/${id}/delete/`, {
            method: 'DELETE'
        })
        navigate('/')
    }

    let handleSubmit = async () => {
        if (id !== 'new' && (!note.body || !note.body.trim())) {
            await deleteNote()
        } else if (id !== 'new') {
            await updateNote()
        } else if (id === 'new' && note.body && note.body.trim()) {
            await createNote()
        }
        navigate('/')
    }

    return (
        <div className='note'>
            <div className="note-header">
                <div className="note-back-action">
                    <button type="button" className="icon-button" onClick={handleSubmit} title="Save and go back" aria-label="Go back">
                        <ArrowLeft />
                    </button>
                </div>
                <div className="note-actions">
                    {id !== 'new' ? (
                        <button type="button" className="btn btn-delete" onClick={deleteNote}>Delete</button>
                    ) : (
                        <button type="button" className="btn btn-save" onClick={handleSubmit}>Save</button>
                    )}
                </div>
            </div>
            <div className="note-body">
                <textarea
                    placeholder="Start typing your note here..."
                    onChange={(e) => { setNote({ ...note, 'body': e.target.value }) }}
                    value={note.body || ''}
                    autoFocus
                />
            </div>
        </div>
    )
}

export default NotePage
