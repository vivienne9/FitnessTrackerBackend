const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {

  //eslint-disable-next-line no-useless-catch
  try {
      const { rows:[routine]} = await client.query(`
      INSERT INTO routines ("creatorId","isPublic",name, goal)
      VALUES ($1,$2,$3,$4)
      RETURNING id,"creatorId","isPublic",name,goal
      `, [creatorId,isPublic,name,goal]);
      
      console.log(routine);
      return routine;
  
    } catch (error) {
       throw error;
    }
}

async function getRoutineById(routineId) {

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows } = await client.query(`
    SELECT * FROM routines
    WHERE id=${routineId};
    `);

    const [routine] = rows;
    return routine;

  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows} = await client.query(`
      SELECT * FROM routines`);

    const [routines] = rows;
    console.log(routines);
    return routines;

  } catch (error) {
    throw error;
  }
}

    // SELECT routines.*,
    // users.username AS "creatorName"
    // FROM routines
    // JOIN users ON users.id = routines."creatorId";
    // `);
    
 

async function getRoutinesWithoutActivities() {
  //eslint-disable-next-line no-useless-catch


}

async function getAllPublicRoutines() {
  //eslint-disable-next-line no-useless-catch
    try{
      const {rows} = await client.query(`
      SELECT *
      FROM routines
      WHERE "isPublic" = true
      `)
      console.log(routines);
      const [routines] = rows;
      return routines;

    }catch(error){
      throw error;
    }
  }


async function getAllRoutinesByUser({ username }) {



}

async function getPublicRoutinesByUser({ username }) {


}

async function getPublicRoutinesByActivity({ id }) {

}

async function updateRoutine({ id, ...fields }) {

}

async function destroyRoutine(id) {


}

module.exports = {
  createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
};
