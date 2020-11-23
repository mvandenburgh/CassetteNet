import React, { useContext, useEffect, useState } from 'react';
import { getAdmins, getUser, getUserProfilePictureUrl, userSearch } from '../utils/api';
import { debounce } from 'lodash';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import UserContext from '../contexts/UserContext';

function UserSearchBar(props) {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { userSelectHandler } = props;

  useEffect(() => {
    if (!searchQuery) {
      setOptions([]);
      return; // don't bother calling server if search is empty
    }
    setLoading(true); // make loading circle appear
    if (searchQuery.charAt(0) === '#') {
      userSearch(searchQuery)
        .then(res => {
          setOptions(res);
          setLoading(false);
        })
        .catch(err => alert(err));
    } else {
      userSearch(searchQuery)
        .then(res => {
          setOptions(res);
          setLoading(false);
        })
        .catch(err => alert(err));
    }
  }, [searchQuery]);

  const search = (e) => {
    if (e.target.value) {
      setSearchQuery(e.target.value);
    }
  }

  return (
    <Autocomplete
      style={{ width: 300 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(e, value) => userSelectHandler(value)}
      getOptionSelected={(option, value) => option._id === value._id}
      getOptionLabel={(option) => option?.username}
      options={options}
      filterOptions={x => x}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyPress={() => setLoading(true)}
          onBlur={() => setLoading(false)}
          onChange={(e) => search(e)}
          label="Search"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(user) => (
        <React.Fragment style={{ height: '2em' }}>
          <img style={{ height: '2em', marginRight: '2em' }} src={getUserProfilePictureUrl(user._id)} />
          <span>{user.username} #({user.uniqueId.toString(36).padStart(4, '0')})</span>
        </React.Fragment>
      )}
    />
  );
}

export default UserSearchBar;
