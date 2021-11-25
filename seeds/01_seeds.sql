INSERT INTO users VALUES (1, 'Max Power', 'maxpow@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Homer Thompson', 'hsimpson@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Guy Incognito', 'guy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties
VALUES (1, 1, 'title 1', 'description', 'https://i.imgur.com/rfDyBby.jpeg', 'https://i.imgur.com/rfDyBby.jpg', 30, 3, 2, 3, 'Canada', '123 Fake St', 'Toronto', 'Ontario', 'A1A 1A1', true),
(2, 2, 'title 2', 'description', 'https://i.imgur.com/rfDyBby.jpeg', 'https://i.imgur.com/rfDyBby.jpg', 100, 3, 3, 5, 'Canada', '127 Fake St', 'Toronto', 'Ontario', 'A1A 1A1', true),
(3, 3, 'title 3', 'description', 'https://i.imgur.com/rfDyBby.jpeg', 'https://i.imgur.com/rfDyBby.jpg', 20, 5, 1, 2, 'Canada', '131 Fake St', 'Toronto', 'Ontario', 'A1A 1A1', true);

INSERT INTO reservations
VALUES (1, '2021-11-24', '2021-11-30', 2, 1),
(2, '2021-12-24', '2022-01-05', 1, 2),
(3, '2021-12-28', '2021-01-04', 1, 3);

INSERT INTO property_reviews
VALUES (1, 1, 2, 1, 5, 'message'),
(2, 2, 1, 2, 4, 'message'),
(3, 3, 1, 3, 2, 'message');