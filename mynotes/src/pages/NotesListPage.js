import React, { useState, useEffect } from 'react'
import ListItem from '../components/ListItem.js'
import AddButton from '../components/AddButton.js'

const NotesListPage = () => {
    let [notes, setNotes] = useState([])
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        getNotes()
    }, [])

    let getNotes = async () => {
        try {
            let response = await fetch('/api/notes/')
            let data = await response.json()
            setNotes(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching notes:', error)
            setNotes([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='notes'>
            <div className="notes-header">
                <div className="notes-title-group">
                    <h2 className="notes-title">Notes</h2>
                    <span className="notes-count-badge">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </span>
                </div>
            </div>

            <div className='notes-list'>
                {loading ? (
                    <div className="notes-status-message">Loading notes...</div>
                ) : notes.length === 0 ? (
                    <div className="notes-empty-state">
                        <div className="empty-icon">📓</div>
                        <h3>No notes yet</h3>
                        <p>Capture your thoughts by clicking the add button below.</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div className='note-preview' key={note.id}>
                            <ListItem note={note} />
                        </div>
                    ))
                )}
            </div>
            <AddButton />
        </div>
    )
}

export default NotesListPage
