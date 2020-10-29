import React, { useEffect, useRef, useState } from 'react';
import { Button, ClickAwayListener, Grid, Grow, MenuItem, MenuList, Paper, Popper, TextField } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon, Search as SearchIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    search: {
      position: 'absolute',
      right: '5%',
      marginLeft: 0,
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      marginRight: '10px',
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      right: 0,
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

const suggestionsSongs = [
    {title: 'Watermelon Sugar', artist: 'Harry Styles' },
    {title: 'Circles', artist: 'Post Malone'},
    {title: 'Better Now', artist: 'Post Malone'},
    {title: 'Stand by Me', artist: 'Ben. E King'},
    {title: 'Sucker', artist: 'Jonas Brothers'},
    {title: 'Slow Dancing in the Dark', artist:'Joji'},
  ];

function DropDown(props) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('mixtapes');
    const anchorRef = useRef(null);

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    const handleDropdownSelect = (type) => {
        setType(type);
        setOpen(false);
    }
  
    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    }

    const prevOpen = useRef(open);
    useEffect(() => {
      if (prevOpen.current && !open) {
        anchorRef.current.focus();
      }
      prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <div style={{backgroundColor: 'white', borderBottom: '0px', border: '2px solid black', borderLeft: '1px', borderTop: '1px', width: '8em', height: 'calc(100% - 0px)'}}>
                <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                startIcon={<ArrowDropDownIcon />}
                style={{height: '100%', width: '100%'}}
                >
                    {type}
                </Button>
            </div>
            
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        <MenuItem onClick={() => handleDropdownSelect('mixtapes')}>Mixtapes</MenuItem>
                        <MenuItem onClick={() => handleDropdownSelect('users')}>Users</MenuItem>
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>
        </div>
    )
}

function SearchBar(props) {
    const classes = useStyles();
    return (
        <div className={classes.search}>
            <Grid container style={{border: '2px solid black'}}>
                <DropDown />
                <Autocomplete 
                size="small"
                freeSolo 
                disableClearable
                options={suggestionsSongs.map((option)=>option.title)}
                renderInput={(params)=>(
                <TextField
                {...params}
                // label="Search..."
                variant="filled"
                InputProps={{ style: { fontSize: '1.5em' }, disableUnderline: true, type: 'search' }}
                />
                )}
                />
                
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
            </Grid>
        </div>
    )
}

export default SearchBar;
