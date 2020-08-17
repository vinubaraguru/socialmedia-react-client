import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'
import { useForm } from '../utils/Hooks'
import { AuthContext } from '../utils/context/auth'

export const Login = (props) => {
    const context = useContext(AuthContext)
    const [error, setError] = useState({})
    const { values, onChange, onSubmit } = useForm(login, {
        username:'',
        password:''
    })

    const [loginUser, {loading}] = useMutation(Login_USER,{
        update(_,result){
            context.login(result.data.login)
            props.history.push('/')
        },
        onError(err){
            console.log(err);
            setError(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function login(){
        loginUser();
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading? 'loading':''}>
                <h1>Login</h1>
                <Form.Input
                    label='Username'
                    placholder='Username'
                    name='username'
                    type='text'
                    value={values.username}
                    error={error.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label='Password'
                    placholder='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    error={error.password ? true : false}
                    onChange={onChange}
                />
                <Button type='submit' primary>
                    Login
                </Button>
            </Form>
            {Object.values(error).length>0 && (
                <div className='ui error message'>
                    <ul className='list'>
                        {Object.values(error).map(value=>(
                            <li key={value}>
                                {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const Login_USER = gql`
    mutation login(
        $username:String!
        $password:String!
    ){
        login(
            username:$username
            password:$password
        ){
            id
            email
            token
            username
            createdAt
        }
    }
`
