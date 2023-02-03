const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows:[activity]} = await client.query(`
    INSERT INTO activities (name,description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, description]);
    
    console.log(activity);
    return activity;

  } catch (error) {
     throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows} = await client.query(`
      SELECT * FROM activities`);

    return rows;

  } catch (error) {
    throw error;
  }
}

async function getActivityById(activityId) {
  
  //eslint-disable-next-line no-useless-catch
  try {
    const { rows } = await client.query(`
    SELECT * FROM activities
    WHERE id=${activityId};
    `);

    const [activity] = rows;
    return activity;

  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {

  //eslint-disable-next-line no-useless-catch
  try {
    const { rows} = await client.query(`
      SELECT * FROM activities 
      WHERE name = $1
    `,[name]);

    const [activity] = rows;
    return activity;

  } catch (error) {
    throw error;
  }
}


async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities




}

async function updateActivity({ activityId, name, description}) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  //eslint-disable-next-line no-useless-catch
  try {
    const { row:[activity]} = await client.query(`
      UPDATE activities
      SET name = "Test" , description = "Activity"
      WHERE id = ${activityId}
    `,[name,description]);

    return activity;

  }catch (error){
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
