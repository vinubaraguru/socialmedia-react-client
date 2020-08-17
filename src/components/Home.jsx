import React, { useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Grid, Image, Transition } from 'semantic-ui-react'
import { PostCard } from './PostCard';
import { AuthContext } from '../utils/context/auth';
import { PostForm } from './PostForm';

export const Home = () => {
    const { user } = useContext(AuthContext);
    const {loading, data } = useQuery(FETCH_POSTS_QUERY);
    console.log(data);
    return (
        <Grid columns={3}>
            <Grid.Row style={{marginLeft:'15px'}}>
                <h3>Recent Posts</h3>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm/>
                    </Grid.Column>
                )}
                {loading?(
                    <h4 style={{marginLeft:'15px'}}>Loading posts...</h4>
                ):(
                    <Transition.Group>
                        {
                             data && data.getPosts && data.getPosts.map(post=>(
                                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                    <PostCard post={post}/>
                                </Grid.Column>
                            ))
                        }
                    </Transition.Group>
                   
                )}
            </Grid.Row>
        </Grid>
    )
}

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

