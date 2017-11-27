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
      let hotels = attractions.filter(hotel => hotel.category === 'hotels')
      console.log('hotels:', hotels)
      // let restaurants = attractions.filter(restaurant => restaurant.category === 'restaurants')
      // let activities = attractions.filter(activity => activity.category === 'activities')
      // hotels.forEach(hotel => {
      //     itinerary.setHotel([hotel])
      //     console.log('hotel is', hotel)
      //   })
      itinerary.setHotels(hotels[0].id)

      .then(()=> {console.log(hotels)})
      res.status(200).send('hello')
      // const promiseArr = [Promise.each(hotels, hotel => {
      //   itinerary.setHotel(hotel)
      // }),
      // Promise.each(restaurants, restaurant => {
      //   itinerary.setRestaurant(restaurant)
      // }),
      // Promise.each(activities, activity => {
      //   itinerary.setActivity(activity)
      // })]
      // Promise.all(promiseArr).then(() => {
      //   res.json(itinerary)
      // })
    })
    .catch(next)
})


module.exports = router;
