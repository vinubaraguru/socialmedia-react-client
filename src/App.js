import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Home} from './components/Home';
import {Login} from './components/Login';
import {Register} from './components/Register';
import { MenuBar } from './components/MenuBar';
import { Container } from 'semantic-ui-react';
import { AuthProvider } from './utils/context/auth';
import { AuthRoute } from './utils/context/authroute';
import { SinglePost } from './components/SinglePost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container className="ui container">
            <MenuBar/>
            <Switch>
              <Route exact path='/' component={Home} />
              <AuthRoute path='/login' component={Login} />
              <AuthRoute path='/register' component={Register} />
              <Route path='/posts/:postId' component={SinglePost} />
            </Switch>
        </Container>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
