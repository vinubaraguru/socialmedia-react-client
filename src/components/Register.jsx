import React, { useState, useContext }  from 'react'
import { Form, Button } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'
import { useForm } from '../utils/Hooks'
import { AuthContext } from '../utils/context/auth'

export const Register = (props) => {
    const context = useContext(AuthContext)
    const [error, setError] = useState({})
    const { values, onChange, onSubmit } = useForm(registerUser, {
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const [addUser, {loading}] = useMutation(REGISTER_USER,{
        update(_,result){
            context.login(result.data.register)
            props.history.push('/')
        },
        onError(err){
            setError(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function registerUser(){
        addUser();
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading? 'loading':''}>
                <h1>Register</h1>
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
                    label='Email'
                    placholder='Email'
                    name='email'
                    type='email'
                    value={values.email}
                    error={error.email ? true : false}
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
                <Form.Input
                    label='Confirm Password'
                    placholder='Confirm Password'
                    name='confirmPassword'
                    type='password'
                    value={values.confirmPassword}
                    error={error.confirmPassword ? true : false}
                    onChange={onChange}
                />
                <Button type='submit' primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username:String!
        $email:String!
        $password:String!
        $confirmPassword:String!
    ){
        register(registerInput:{
            username:$username
            password:$password
            confirmPassword: $confirmPassword
            email:$email
          }
        ){
            id
            email
            token
            username
            createdAt
        }
    }
`
