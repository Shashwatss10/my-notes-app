import React from 'react'
import { Link } from 'react-router-dom'

let getTitle = (note) => {
    if (!note || !note.body) return 'Untitled Note'
    let title = note.body.split('\n')[0].trim()
    if (!title) return 'Untitled Note'
    if (title.length > 35) {
        return title.slice(0, 35) + '...'
    }
    return title
}

let getDate = (note) => {
    if (!note || !note.updated) return ''
    const d = new Date(note.updated)
    return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

let getContent = (note) => {
    if (!note || !note.body) return 'Empty note'
    let title = note.body.split('\n')[0]
    let content = note.body.replace(title, '').trim()
    if (!content) return 'No additional text'
    if (content.length > 75) {
        return content.slice(0, 75) + '...'
    }
    return content
}

const ListItem = ({ note }) => {
    return (
        <div className='notes-list-item'>
            <Link to={`/note/${note.id}`}>
                <div className='notes-list-item-header'>
                    <h3>{getTitle(note)}</h3>
                    <span className='notes-list-item-date'>{getDate(note)}</span>
                </div>
                <p className='notes-list-item-snippet'>{getContent(note)}</p>
            </Link>
        </div>
    )
}

export default ListItem
