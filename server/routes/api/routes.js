const Route = require('../../models/Route');
const mongoose = require('mongoose');

module.exports = (app) => {
  app.get('/api/routes/:id', (req, res, next) => {
    Route.findById(req.params.id)
      .exec()
      .then((route) => res.json(route))
      .catch((err) => next(err));
  });

  app.delete('/api/routes/:id', function (req, res) {
    Route.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then(() => {
        res.status(200)
            .json({
              success: true})
        
      })
      .catch((err) => {
        res.status(400)
          .json({
            message: err || "Something went wrong..."
          })
      });
  });


  app.post('/api/routes', function (req, res) {
    let route = new Route(req.body);
    route.save()
      .then((route) => {
        res.send(route)
      })
      .catch((err) => {
        res.status(400)
          .json({
            message: err || "Something went wrong."
          })
      });
  });

  app.put('/api/routes', function(req, res) {
    let mappedIds = req.body.routesIds.map(id => {
      return {_id: mongoose.Types.ObjectId(id)}
    });
    Route.aggregate([
     {$match: {$or: mappedIds}}
    ])
      .exec()
      .then((result) => {
        res.send(result)
      })
      .catch((err) => {
        res.status(400)
          .json({
            message: err || "Something went wrong..."
          })
      });

  })

};
