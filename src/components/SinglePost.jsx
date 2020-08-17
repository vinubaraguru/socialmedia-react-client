import React, { useContext, useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import { AuthContext } from '../utils/context/auth';
import { Grid, Image, Card, Button, Label, Icon, Form } from 'semantic-ui-react';
import { DeleteButton } from './DeleteButton';
import { LikeButton } from './LikeButton';
import moment from 'moment';

export const SinglePost = (props) => {
    const postId = props.match.params.postId;
    const {user} = useContext(AuthContext)

    const [comment, setcomment] = useState('')

    const [ submitComment ] = useMutation(SUBMIT_COMMENT_MUTATION,{
        update(){
            setcomment('')
        },
        variables:{
            postId,
            body:comment
        }
    })


    const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
        variables: {
          postId
        }
      })
    function deletePostCallback(){
        props.history.push('/')
    }
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error.</p>
    let postMarkup
      if (!data.getPost) {
        postMarkup = <p>Loading Post...</p>
      } else {
        const {
          id,
          body,
          createdAt,
          username,
          comments,
          likes,
          likeCount,
          commentCount
        } = data.getPost

    
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
                            size='small'
                            float='right'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                                <Card.Description>
                                {body}
                                </Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton post={{id, likes, likeCount}}/>
                                <Button labelPosition='right' as='div' onClick={()=> console.log('comment')}>
                                    <Button  color='blue' basic>
                                        <Icon name='comments' />
                                    </Button>
                                    <Label basic color='blue' pointing='left'>
                                        {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/>}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type='text'
                                                placeholder='write a comment'
                                                name='comment'
                                                value={comment}
                                                onChange={event=> setcomment(event.target.value)}
                                            />
                                            <Button 
                                                type='submit' 
                                                className='ui button teal' 
                                                disabled={comment.trim()===''}
                                                onClick={submitComment}
                                                >
                                                Comment
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment=>(
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username &&(
                                        <DeleteButton postId={id} commentId={comment.id}></DeleteButton>
                                    )}
                                    <Card.Header>
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>
                                         {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation ($postId: ID!, $body:String!){
        createComment(postId:$postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId:ID!){
        getPost(postId:$postId){
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