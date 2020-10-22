import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import StartPage from './components/pages/StartPage';
import PageFrame from './components/PageFrame';

function App() {
  // TODO: use something like this later. For now, just set as a boolean.
  // const [loggedIn, setLoggedIn] = useState(false);
  const loggedIn = false;

  return (
    <div className="App">
      <BrowserRouter>
          <div className="App">
            <PageFrame invisible={!loggedIn} />
            <Switch>
              <Route exact path="/" component={StartPage} /> {/* TODO: should redirect to dashboard when logged in */}
            </Switch>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;
