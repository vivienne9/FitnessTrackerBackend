const client = require('./client');
const SALT_COUNT = 10;
const bcrypt = require('bcrypt')

// database functions
// user functions
async function createUser({ username, password }) {

  try{
   const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

   const { rows:[user] } = await client.query(`
    INSERT INTO users(username,password)
    VALUES($1,$2)
    RETURNING *;
    `,[username,hashedPassword]);
    delete user.password;
    return user;

  }catch(error){
    throw Error('failed to create user')}
}

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;

  // isValid will be a boolean based on whether the password matches the hashed password
  const isValid = await bcrypt.compare(password, hashedPassword);

  if (isValid){
  try {
    const { row:[user ]} = await client.query(`
      SELECT id, username FROM users;`
      );
    return user;
    
  } catch (error) {
    console.log(error,"Error getting user");
  }
}

}

async function getUserById(userId) {

  try {
    const { row: [user] } = await client.query(`
      SELECT id, username  FROM users
      WHERE id=${userId};
      `);

    if (!user) {
          return null
    }

    return user;
  } catch (error) {
    console.log(error,"Error getting user by id");
  }

}

async function getUserByUserName(username) {

  try {
    const { row: [user] } = await client.query(`
      SELECT id, username, password FROM users
      WHERE username=${username};
      `);

    if (!user) {
          return null
    }

    return user;
  } catch (error) {
    throw new Error (error, "Error getting user by name");
  }
}

async function createActivity ({ name, description }) {

  try {
    const { rows:activity} = await client.query(`
    INSERT INTO activities (name,description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING 
    RETURNING *;
    `, [name, description]);
    
    return activity;
  } catch (error) {
     console.log(error,"Error creating activity");
  }

}

async function getAllActivities() {

  try {
    const { rows } = await client.query(`
      SELECT id,name,description FROM activities;`
      );
    return rows;
  } catch (error) {
    console.log(error,"Error getting activities");
  }

}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUserName,
  createActivity,
  getAllActivities
}


