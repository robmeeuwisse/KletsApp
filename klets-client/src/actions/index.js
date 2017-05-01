export const FETCH_ROOMS = 'FETCH_ROOMS' // todo: remove unused?
export const RECEIVE_ROOMS = 'RECEIVE_ROOMS'
export const SELECT_ROOM = 'SELECT_ROOM'
export const FETCH_ROOM_MESSAGES = 'FETCH_ROOM_MESSAGES' // todo: remove unused?
export const RECEIVE_ROOM_MESSAGES = 'RECEIVE_ROOM_MESSAGES'

export const selectRoom = (selectedRoom) => ({
    type: SELECT_ROOM,
    selectedRoom
})

export const receiveRooms = (rooms) => ({
    type: RECEIVE_ROOMS,
    rooms
})

export const fetchRooms = () => dispatch => {
    return fetch(`http://localhost:3030/rooms`)
        .then(response => response.json())
        .then(json => dispatch(receiveRooms(json.rooms)))
}

export const receiveRoomMessages = (messages) => ({
    type: FETCH_ROOM_MESSAGES,
    messages
})

export const fetchRoomMessages = (selectedRoom) => dispatch => {
    return fetch(`http://localhost:3030/rooms/${selectedRoom}/messages`)
        .then(response => response.json())
        .then(json => dispatch(receiveRoomMessages(json.messages)))
}

/////////////////////

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

export const selectReddit = reddit => ({
    type: SELECT_REDDIT,
    reddit
})

export const invalidateReddit = reddit => ({
    type: INVALIDATE_REDDIT,
    reddit
})

export const requestPosts = reddit => ({
    type: REQUEST_POSTS,
    reddit
})

export const receivePosts = (reddit, json) => ({
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
})

const fetchPosts = reddit => dispatch => {
    dispatch(requestPosts(reddit))
    return fetch(`https://www.reddit.com/r/${reddit}.json`)
        .then(response => response.json())
        .then(json => dispatch(receivePosts(reddit, json)))
}

const shouldFetchPosts = (state, reddit) => {
    const posts = state.postsByReddit[reddit]
    if (!posts) {
        return true
    }
    if (posts.isFetching) {
        return false
    }
    return posts.didInvalidate
}

export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
        return dispatch(fetchPosts(reddit))
    }
}
