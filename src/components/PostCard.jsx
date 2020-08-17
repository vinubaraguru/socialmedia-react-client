import React, { useContext } from 'react'
import { Card, Image, Button, Icon, Label } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../utils/context/auth'
import { LikeButton } from './LikeButton'
import { DeleteButton } from './DeleteButton'

export const PostCard = (props) => {
    const { user } = useContext(AuthContext);
    const { id, body, createdAt, username, likes, likeCount, commentCount } = props.post

    return (
        <Card fluid>
            <Card.Content>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`posts/${id}`} >{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton post={{id, likes, likeCount}}/>
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                    <Button color='blue' basic>
                        <Icon name='comment' />
                    </Button>
                    <Label basic color='blue' pointing='left'>
                        {commentCount}
                    </Label>
                </Button>
                {user && user.username === username && <DeleteButton postId={id}/>}
            </Card.Content>
        </Card>
    )
}
