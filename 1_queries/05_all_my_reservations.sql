SELECT reservations.*, properties.*, avg(rating) as average_rating
FROM reservations
JOIN properties on property_id = properties.id
JOIN property_reviews on property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
AND end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;