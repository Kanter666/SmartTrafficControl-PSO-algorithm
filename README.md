# Solution implemented - Particle swarm optimization algorithm
## Problem domain
Problem of assigning jams to multiple cars can be described as multi-agent multi-depot Travelling salesman problem where cars don't have to return back to depo. This kind of problems are NP hard and with increasing number of jams(cities) become too computationally difficult for algorithms with guaranted optimal solution.
## Particle swarm optimization algorithm
Particle swarm optimization algorithm is inspired by bird flock - where potential solutions=particles(birds) go through problem space following the leaders(best solutions). It's very similar to genetic algorithm, but replaces mutation and combination with following the leader.

It is mixed with simple optimization algorithms and random generation. As the result every particle during every iteration either follows the local/global leader, explores new solutions or generates new random particle. The choice is random with highest probability towards following leaders, then exploring and small chance of generating new solution.

If particle follows the leader then it gets velocity represented as array of jams with their position from local and global optimum. Applying the velocity is done randomly that particles don't have the same velocity and don't get to optimal position in one move.

Exploring solutions is done by switching jams and recording best change - switching can be done in one car assignment, or between two cars. Globally best particle always explores new/better solutions. 
## Limitations and possible improvements
This implementation in javascript is limited by obtaining proper distances between points on map - google maps api extends run time, has daily limit and geographic locations are not accurate enough. This algorithm also doesn't count with delay caused by real jam - it works just with normal time to travel there. It can route cars through already checked jams if it is the "shortest" route.

Another issue is that success of particle is evaluated by the slowest car assign - that leads to focusing on the slowest car and not optimizing other cars that effectively.

Questionable is also the part of PSO algorithm since it hasn't been tested without it, with just random population and optimization.


# node-js-getting-started

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
