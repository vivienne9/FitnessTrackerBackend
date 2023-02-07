/* eslint-disable no-undef */
const client = require("./client");
const { attachActivitiesToRoutines } = require('./activities')


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
    const { rows:routines} = await client.query(`
      SELECT routines.* ,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId";
      `);

      for (let i = 0; i < routines.length; i++) {
        routines[i].activities = await attachActivitiesToRoutines (routines[i]);
      }
    
    console.log(routines);
    return routines;

  } catch (error) {
    throw error;
  }
}
 

async function getRoutinesWithoutActivities() {
  //eslint-disable-next-line no-useless-catch

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows:routine} = await client.query(`
      SELECT routines.* ,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId";
      `);

      console.log(routine);
      return routine;
  
    } catch (error) {
      throw error;
    }
  }

async function getAllPublicRoutines() {
  //eslint-disable-next-line no-useless-catch
   try {
    const { rows:routines} = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      WHERE "isPublic" = true;
      `);


      for (let i = 0; i < routines.length; i++) {
        routines[i].activities = await attachActivitiesToRoutines (routines[i]);
      }

     console.log(routines);
     return routines;

  } catch (error) {
    throw error;
  }
  }


async function getAllRoutinesByUser({ username }) {

//eslint-disable-next-line no-useless-catch
try {
  const { rows:routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName" 
    FROM routines
    JOIN users ON users.id = routines."creatorId"
    WHERE users.username = $1;
    `,[username]);

    if (!routines) return null;


    for (let i = 0; i < routines.length; i++) {
      routines[i].activities = await attachActivitiesToRoutines (routines[i]);
    }

   console.log(routines);
   return routines;

} catch (error) {
  throw error;
}

}

async function getPublicRoutinesByUser({ username }) {

//eslint-disable-next-line no-useless-catch
try {
  const { rows:routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName" 
  FROM routines
  JOIN users ON users.id = routines."creatorId"
  WHERE users.username = $1 AND "isPublic" = true;
    `,[username]);

    if (!routines) return null;
   
    for (let i = 0; i < routines.length; i++) {
      routines[i].activities = await attachActivitiesToRoutines (routines[i]);
    }

   console.log(routines);
   return routines;

} catch (error) {
  throw error;
}
}

async function getPublicRoutinesByActivity({ activityId }) {

  //eslint-disable-next-line no-useless-catch
  try{
  const { rows:routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName" ,
  FROM routines
  JOIN users ON users.id = routines."creatorId"
  JOIN routine_activities ON routine_activities."activityId" = activities.id
  WHERE routine_activities."activityId" = $1;
  ;`,[activityId]);

    if (!routines) return null;
   
    for (let i = 0; i < routines.length; i++) {
      routines[i].activities = await attachActivitiesToRoutines (routines[i]);
    }

   console.log(routines);
   return routines;

} catch (error) {
  throw error;
}

}

async function updateRoutine({ id, ...fields }) {

  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
).join(', ');


  if (setString.length === 0) {
    return;
  }

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows: [routine] } = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields),);

    return routine;

  }catch (error){
    throw error;
  }
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
