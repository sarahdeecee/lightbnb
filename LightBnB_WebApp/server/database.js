const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
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
  const values = [];
  let queryString = `
  SELECT properties.*, avg(rating) as average_rating
  FROM properties
  JOIN property_reviews on properties.id = property_id
  `;
  let keyword = 'WHERE';

  // Add the city query to the query string
  if (options.city) {
    values.push(`%${options.city}%`);
    queryString += `${keyword} city LIKE $${values.length} `;
    keyword = 'AND';
  }

  // Add the min price per night query to the query string
  if (options.minimum_price_per_night) {
    values.push(options.minimum_price_per_night * 100);
    queryString += `${keyword} cost_per_night >= $${values.length} `;
    keyword = 'AND';
  }

  // Add the max price per night query to the query string
  if (options.maximum_price_per_night) {
    values.push(options.maximum_price_per_night * 100);
    queryString += `${keyword} cost_per_night <= $${values.length} `;
  }

  // Add the ordering and grouping to the query string
  queryString += `
  GROUP BY properties.id
  `;

  // Add the rating query to the query string
  if (options.minimum_rating) {
    keyword = 'HAVING';
    values.push(options.minimum_rating);
    queryString += `${keyword} avg(rating) >= $${values.length}`;
  }

  // Add the limit to the query string
  values.push(limit);
  queryString += `
  ORDER BY cost_per_night ASC
  LIMIT $${values.length};
  `;
  return pool
    .query(queryString, values)
    .then(result => result.rows)
    .catch(err => console.error(err.message));
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = property => {
  const values = [];
  const numberValues = ['number_of_bedrooms', 'number_of_bathrooms', 'parking_spaces'];
  for (let value in property) {
    if (numberValues.includes(value)) {
      values.push(Number(property[value]));
    } else {
      values.push(property[value]);
    }
  }
  const keys = Object.keys(property);
  let keyString = "";
  let valueString = "";

  keys.forEach(key => {
    if (keyString === '') {
      keyString += `${key}`;
    } else {
      keyString += `, ${key}`;
    }
  });
  
  for (let i = 1; i <= values.length; i++) {
    if (i === values.length) {
      valueString += `$${i}`;
    } else {
      valueString += `$${i}, `;
    }
  }
  
  const queryString = `
  INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES (${valueString})
  RETURNING *;
  `;

  return pool
    .query(queryString, values)
    .then(result => result.rows)
    .catch(err => console.error(err.message));
};
exports.addProperty = addProperty;
