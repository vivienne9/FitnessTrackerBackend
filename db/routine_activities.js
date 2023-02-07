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
  const { rows } = await client.query(`
  SELECT routine_activities.* ,
  routines.name
  FROM routine_activities
  JOIN routines ON routine_activities."routineId" = routines.id
  WHERE routine_activities."routineId" = $1;
  `,[routineId]);

  const [routine_activities] = rows;
  return routine_activities;

} catch (error) {
  throw error;
}

}

async function updateRoutineActivity({ id, ...fields }) {



}

async function destroyRoutineActivity(id) {

}

async function canEditRoutineActivity(routineActivityId, userId) {

}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
