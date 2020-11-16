import React, { useEffect, useState } from 'react';
import { songSearch } from '../utils/api';
import { debounce } from 'lodash';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';


function SongSearchBar(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const { apiToUse, setSelected, toExclude } = props;

  useEffect(() => {
    if (!searchQuery) return; // don't bother calling youtube api if search is empty
    setLoading(true); // make loading circle appear
    songSearch(apiToUse, searchQuery)
      .then(res => {
        setOptions(res.filter(s => !toExclude.includes(s.id)));
        setLoading(false);
        console.log(res)
      })
      .catch(err => alert(err));
  }, [searchQuery]);

  const search = (e) => {
    if (e.target.value) {
      setSearchQuery(e.target.value);
    }
  }

  return (
    <Autocomplete
      // style={{ width: 300 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(option, value) => setSelected(value)}
      getOptionLabel={option => option.name}
      getOptionSelected={(option, value) => option.id === value.id}
      options={options}
      loading={loading}
      clearOnBlur={false}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyPress={() => setLoading(true)}
          onBlur={() => setLoading(false)}
          onChange={debounce((e) => search(e), 500)} // debounce every 700ms to prevent calling api more than needed
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
    />
  );
}

export default SongSearchBar;
