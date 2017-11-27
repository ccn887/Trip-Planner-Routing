const router = require("express").Router();
const Hotel = require("../models").Hotel;
const Restaurant = require("../models").Restaurant;
const Activity = require("../models").Activity;
const Itinerary = require("../models").Itinerary;

router.get("/", (req, res, next) => {
  Promise.all([
    Hotel.findAll({ include: [{ all: true }] }),
    Restaurant.findAll({ include: [{ all: true }] }),
    Activity.findAll({ include: [{ all: true }] })
  ])
    .then(([hotels, restaurants, activities]) => {
      res.json({
        hotels,
        restaurants,
        activities
      });
    })
    .catch(next);
});

router.get('/itineraries/:itinerary_id', (req, res, next) => {
  Itinerary.findById(+req.params.itinerary_id, {
    include: [{ all: true, nested: true }]
  })
    .then(itinerary => {
      console.log('itinerary is ', itinerary)
      res.json(itinerary)
    })
    .catch(next);
});

router.post('/itineraries', (req, res, next) => {
  Itinerary.create()
    .then(itinerary => {
      console.log('itinerary is:', itinerary)

      let id = itinerary.id
      let attractions = req.body
      let hotels = attractions.filter(hotel => hotel.category === 'hotels').map(function(hotel){
        return hotel.id
      })
      let restaurants = attractions.filter(restaurant => restaurant.category === 'restaurants').map(function(restaurant){
        return restaurant.id
      })
      let activities = attractions.filter(activity => activity.category === 'activities').map(function(activity){
        return activity.id
      })

      Promise.all([itinerary.setHotels(hotels),
      itinerary.setRestaurants(restaurants),
      itinerary.setActivities(activities)])

      .then(()=> {
        res.status(200).json(itinerary)
      })
    })
    .catch(next)
})


module.exports = router;
