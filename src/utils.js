const uuid4 = require("uuid4")
const Users = require("./database/models/users")

const addNewUser = async function (newUserData, token = "") {
    const userId = uuid4()
    console.log(`[+] Adding user: ${newUserData.username}, ${newUserData.email}`)
    const newUser = new Users({userId: userId, ...newUserData, sessionKey: token})
    newUser.save(async function (err) {
        if (err) {
            console.log(`[-] Error adding new user or user already exists: ${err} `)
            throw new Error("Failed to add new user to DB")
        }
    })
}
module.exports.addNewUser = addNewUser;