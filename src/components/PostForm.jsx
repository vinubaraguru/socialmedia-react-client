import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../utils/Hooks'
import { gql, useMutation } from '@apollo/client'

export const PostForm = () => {
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, {loading,error}] = useMutation(CREATE_POST_MUTATION,{
        variables: values,
        update(cache, result){
            const data = cache.readQuery({
                query : FETCH_POSTS_QUERY
            });
            cache.writeQuery({query: FETCH_POSTS_QUERY, data: { getPosts: [result.data.createPost, ...data.getPosts] } });
            values.body = '';
        },
        onError(err){
        },
    })

    function createPostCallback(){
        createPost();
    }

    return (
    <>
       <Form onSubmit={onSubmit} >
           <h3>Create a Post:</h3>
           <Form.Field>
               <Form.Input
                    placeholder='Write Something'
                    name='body'
                    onChange={onChange}
                    type='text'
                    value={values.body}
                    error={error ? true:false}
               />
               <Button type='Submit' color='teal'>
                    Submit
               </Button>
           </Form.Field>
       </Form>
       {loading && <p>Loading...</p>}
       {error && (
           <div className='ui error message' style={{ marginBottom: 5 }}>
            <ul className='list'>
                <li>
                    {error.graphQLErrors[0].message}
                </li>
            </ul>
           </div>
       )}
       </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost(
        $body:String!
    ){
        createPost(
            body:$body
        ){
            id
            body
            createdAt
            username
            comments{
                id
                body
                createdAt
                username
            }
            likes{
                id
                createdAt
                username
            }
            likeCount
            commentCount
        }
    }
`

const FETCH_POSTS_QUERY = gql`
    {
        getPosts{
            id
            body
            createdAt
            username
            comments{
                id
                body
                createdAt
                username
            }
            likes{
                id
                createdAt
                username
            }
            likeCount
            commentCount
        }
    }
`
