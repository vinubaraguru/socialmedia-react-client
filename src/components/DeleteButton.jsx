import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Confirm, Icon, Button } from 'semantic-ui-react'

export const DeleteButton = ({postId, commentId, callback}) => {

    const [cofirmOpen, setCofirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePost] = useMutation(mutation,{
        update(cache){
            setCofirmOpen(false)
            if(!commentId){
                const data = cache.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                data.getPosts = data.getPosts.filter(p=>p.id !== postId);
                cache.writeQuery({query: FETCH_POSTS_QUERY, data});
            }
            if(callback) callback();
        },
        variables:{
            postId,
            commentId
        },
        onError(err){
            console.log(err)
        },
    })

    return (
        <>
             <Button as='div'   color='red' floated='right' onClick={()=>setCofirmOpen(true)} >
                <Icon name='trash' style={{margin:0}} />
            </Button>
            <Confirm
                open={cofirmOpen}
                onCancel={()=>setCofirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId:ID!){
        deletePost(postId:$postId)
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

const DELETE_COMMENT_MUTATION =gql`
mutation deleteComment($postId:ID!, $commentId: ID!){
    deleteComment(postId:$postId, commentId: $commentId){
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
