import React, { useContext } from 'react'
import { AuthContext } from './auth'
import { Route, Redirect } from 'react-router-dom';

export const AuthRoute = ({ component : Component, ...rest }) => {
    const {user} = useContext(AuthContext);
    return (
        <Route
            {...rest}
                render={props => user ? <Redirect to='/'/> : <Component {...props}/>
            }
        />
    )
}
