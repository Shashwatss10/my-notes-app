import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as AddIcon } from '../assets/add.svg'

const AddButton = () => {
    return (
        <div className='floating-button' title='Create Note'>
            <Link to='note/new/' aria-label='Create Note'>
                <AddIcon />
            </Link>
        </div>
    )
}

export default AddButton
