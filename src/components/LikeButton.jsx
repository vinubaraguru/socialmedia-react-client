import React, { useState, useEffect, useContext } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import { AuthContext } from '../utils/context/auth'
import { Link } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'

export const LikeButton = ({post:{id, likes, likeCount}}) => {
    const {user} = useContext(AuthContext)
    const [liked, setLiked] = useState(false)
    useEffect(()=>{
        if(user && likes && likes.find(like => like.username === user.username)){
            setLiked(true)  
        } else {
            setLiked(false)
        }
    },[user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION,{
        variables : {postId: id},
        onError(err){
        },
    })

    const LikeButton = user ? (
        liked ?(
            <Button color='teal'>
                    <Icon name='heart' />
            </Button>
        ):(
            <Button color='teal' basic>
                    <Icon name='heart' />
            </Button>
        )
    ):(
        <Button as={Link} to='/login' color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
            <Button as='div' labelPosition='right' onClick={likePost}>
                {LikeButton}
                <Label basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
    )
}

const LIKE_POST_MUTATION =gql`
    mutation likePost(
        $postId : ID!
    ){
        likePost(postId:$postId){
            id
           body
           createdAt
           username
           likeCount
           likes{
             id
             username
             username
           }
           comments{
             id
             createdAt
             body
             username
           }
         }
    }
`