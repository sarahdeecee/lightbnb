const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg')
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithEmail = (email) => {
  const queryString = `
    SELECT * FROM users
    WHERE email = $1
  ;`;
  return pool
    .query(queryString, [ email.toLowerCase() ])
    .then((result) => result.rows[0])
    .catch((err) => err.message);
  };
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = (id) => {
  const values = [ id ];
  const queryString = `
    SELECT * FROM users
    WHERE id = $1
  ;`;
  return pool
    .query(queryString, values)
    .then(result => result.rows[0])
    .catch(err => err.message);
  };
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
 const addUser = user => {
  const values = [ user.name, user.email, user.password ];
  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
  ;`;
  return pool
    .query(queryString, values)
    .then(result => (result.rows[0]) ? result.rows[0] : null)
    .catch(err => err.message);
  };
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  const values = [guest_id, limit];
  const queryString = `SELECT *
    FROM reservations
    JOIN properties on property_id = properties.id
    WHERE guest_id = $1
    LIMIT $2
  ;`;
  return pool
  .query(queryString, values)
  .then(result => result.rows)
  .catch(err => err.message);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  console.log("options:",options);
  const values = [];
  let count = 1;
  let queryString = `
  SELECT properties.id, title, cost_per_night, avg(rating) as average_rating
  FROM properties
  JOIN property_reviews on properties.id = property_id
  `;
  let keyword = 'WHERE';
  if (options.owner_id) {
    values.push(options.owner_id);
    queryString += `${keyword} owner_id NOT $${count} `;
    keyword = 'AND';
    count++;
  }
  if (options.city) {
    values.push(options.city);
    queryString += `${keyword} city LIKE '%$${count}%' `;
    keyword = 'AND';
    count++;
  }
  if (options.minimum_price_per_night) {
    values.push(Number(options.minimum_price_per_night) * 100);
    queryString += `${keyword} cost_per_night >= $${count} `;
    keyword = 'AND';
    count++;
  }
  if (options.maximum_price_per_night) {
    values.push(Number(options.maximum_price_per_night) * 100);
    queryString += `${keyword} cost_per_night <= $${count} `;
    count++;
  }
  queryString += `
  ORDER BY cost_per_night ASC
  GROUP BY properties.id
  `;
  if (options.minimum_rating) {
    keyword = 'HAVING';
    values.push(Number(options.minimum_rating));
    queryString += `${keyword} avg(rating) >= $${count}`;
    count++;
  }
  values.push(limit);
  queryString += `
  LIMIT $${count};
  `;
  console.log(queryString);
  console.log(values);
  return pool
    .query(queryString, values)
    .then(result => {
      console.log(result.rows);
      result.rows;
    })
    .catch(err => err.message);
  };
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
