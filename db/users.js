const client = require('./client');
const SALT_COUNT = 10;
const bcrypt = require('bcrypt')

// database functions
// user functions
async function createUser({ username, password }) {

  //eslint-disable-next-line no-useless-catch
  try{
   const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

   const { rows:[user] } = await client.query(`
    INSERT INTO users(username,password)
    VALUES($1,$2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username;
    `,[username,hashedPassword]);
    // delete user.password;
    return user;

  }catch(error){
    throw error;
  }
}

async function getUserByUserName(userName) {

  //eslint-disable-next-line no-useless-catch
  try {
    const {rows} = await client.query(`
      SELECT * FROM users 
      WHERE username = $1
    `,[userName]);

    if(!rows || !rows.length) return null;

    const [users] = rows;
    return users;

  } catch (error) {
    throw error;
  }
  }


async function getUser({ username, password }) {
  if (!username || !password){
    return;
  }

  //eslint-disable-next-line no-useless-catch
  try{

    const user = await getUserByUserName(username);

    if(!user) return;

    const hashedPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if(!passwordMatch) return;

    delete user.password;

    return user;

  }catch (error){
    throw error;
  }

}

async function getUserById(userId) {

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows } = await client.query(`
      SELECT id,username FROM users
      WHERE id=${userId};
      `);

    if (!rows) return null;
    
    const [users] = rows;
    return users;

  } catch (error) {
    throw error;
  }

}


module.exports = {
  createUser,
  getUserByUserName,
  getUser,
  getUserById
}
