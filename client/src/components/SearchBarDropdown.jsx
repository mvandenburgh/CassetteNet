import React from 'react';
import { NativeSelect, withStyles, InputBase } from '@material-ui/core';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

function SearchBarDropdown({ type, setType }) {
    return (
        <NativeSelect
            style={{ height: '100%', top: '0px' }}
            variant="filled"
            value={type}
            onChange={(e) => setType(e.target.value)}
            input={<BootstrapInput />}
        >
            <option value={'mixtapes'}>Mixtapes</option>
            <option value={'users'}>Users</option>
        </NativeSelect>
    )
}

export default SearchBarDropdown;
