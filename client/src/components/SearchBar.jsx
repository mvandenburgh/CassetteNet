import React, { useEffect, useRef, useState } from 'react';
import { Button, ClickAwayListener, Grid, Grow, InputAdornment, MenuItem, MenuList, Paper, Popper, TextField } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon, Search as SearchIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

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
  }));

function DropDown(props) {
    const [open, setOpen] = useState(false);
    const { type, setType } = props;
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

    const history = useHistory();

    const { showDropdown } = props;

    const [type, setType] = useState('mixtapes');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      history.push({
        pathname: `/search/${type}`,
        search: `?query=${searchQuery}&page=1`
      });
    }

    return (
        <div className={classes.search}>
            <Grid container style={{border: '2px solid black'}}>
                <TextField
                  variant="filled"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment>
                        {showDropdown ? <DropDown type={type} setType={setType} /> : undefined}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <SearchIcon onClick={handleSearch} style={{ cursor: 'pointer' }} />
                    )
                  }
                  }
                />
            </Grid>
        </div>
    )
}

export default SearchBar;
