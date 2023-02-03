const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  //eslint-disable-next-line no-useless-catch
    try{
      const {rows: [routine_activitiy]} = await client.query(`
      INSERT INTO routine_activities("routineId","activityId",count,duration)
      VALUES($1,$2,$3,$4)
      RETURNING *;
      `,[ routineId,activityId,count,duration])

      return routine_activitiy;

    }catch(error){
      throw Error(error)
    }
}

async function getRoutineActivityById(id) {

}

async function getRoutineActivitiesByRoutine({ id }) {

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
