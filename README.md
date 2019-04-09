<img src="https://user-images.githubusercontent.com/5770400/55282436-fe1e1300-5300-11e9-9020-f1aee24aff7e.png" width="300" height="300">

[upgraded-octo-adventure](https://secret-dusk-50437.herokuapp.com/)
===================================================================

:octopus: :octopus: :octopus:

Getting Started
---------------

### The Docker Way (simplest)

1. Install & set up Docker: https://github.com/phroggy/upgraded-octo-adventure/wiki/Full-Setup#docker
2. Start the app

    $ docker-compose up

3. Open your browser at `http://localhost:3000/`

### The Non-Docker Way
#### Prerequisites
Install MongoDB:
```bash
$ brew install mongodb
$ brew services start mongodb
$ echo MONGODB_URI=mongodb://mongo:27017/octo >> .env
```

Install dependencies:

```bash
$ npm install
```

#### Run Locally

```bash
$ npm start
```

Alternatively, run with `heroku` command:

```bash
$ heroku local -p 3000
```
Open your browser at `http://localhost:3000/`


Deployment
----------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Deploy to heroku from master:

```bash
$ git push heroku master
```

Deploy to heroku from a non-master branch (e.g. `deploy-branch`) in your local repository:

```bash
$ git push heroku deploy-branch:master
```

Built With
----------

* [Node](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [MongoDB](https://docs.mongodb.com/)
* [Docker](https://www.docker.com/)

Authors
-------

* **[Cameron Leach](https://github.com/phroggy)**
* **[Ellie Hoshizaki](https://github.com/elliehoshi)**
