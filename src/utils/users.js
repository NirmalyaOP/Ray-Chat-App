const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room) {
        return {
            error: "Username and room are required"
        }
    }

    //Check for existing users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username
    if(existingUser) {
        return {
            error: "Username already present in room"
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}


const removeUser = (id) => {
    //findIndex gives the value of index of matched item found or -1 if no match found
    const index = users.findIndex((user) => user.id === id)

    if(index!== -1) {
        //splice(1, 2) 1 is the index from which we want to remove and 2 is number of items that we want to remove
        return users.splice(index, 1)[0]
    }
}


const getUser = (id) => {
    return users.find((user) => user.id === id)
}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const allUsers = users.filter((user) => {
        return user.room === room
    })

    return allUsers
}

addUser({
    id: 36,
    username: "Som ",
    room: "bbsr"
})

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}