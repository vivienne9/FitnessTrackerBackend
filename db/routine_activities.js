const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  //eslint-disable-next-line no-useless-catch
    try{
      const {rows: [routine_activity]} = await client.query(`
      INSERT INTO routine_activities("routineId","activityId",count,duration)
      VALUES($1,$2,$3,$4)
      RETURNING *;
      `,[ routineId,activityId,count,duration])

      return routine_activity;

    }catch(error){
      throw Error(error)
    }
}

async function getRoutineActivityById(routineActivityId) {

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows } = await client.query(`
    SELECT * FROM routine_activities
    WHERE id = $1;
    `,[routineActivityId]);

    const [routine_activities] = rows;
    return routine_activities;

  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ routineId}) {

//eslint-disable-next-line no-useless-catch
try {
  const { rows:routineActivities } = await client.query(
  `SELECT * FROM routine_activities
    WHERE "routineId" = ${routineId};
    `)

  return routineActivities;

} catch (error) {
  throw error;
}

}

async function updateRoutineActivity({ id, ...fields }) {

  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
).join(', ');


  if (setString.length === 0) {
    return;
  }

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows: [routineActivities] } = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields),);

    return routineActivities;

  }catch (error){
    throw error;
  }
}

async function destroyRoutineActivity(id) {

  //eslint-disable-next-line no-useless-catch
  try{
    await client.query(`
      DELETE FROM 
      routine_activities 
      WHERE id=${id}
      RETURNING *;
      `)
  
  }catch (error){
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {

    const { rows: [routineId] } = await client.query(`
      SELECT "routineId" 
      FROM routine_activities 
      WHERE id=${routineActivityId};`, 
      );

    const { rows: [routineCreatorId] } = await client.query(`
      SELECT "creatorId" 
      FROM routines 
      WHERE id=$1;`, 
      [routineId.routineId]);

    if (routineCreatorId.creatorId === userId) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw new Error('cannot answer if user can edit')
  }
}


module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
