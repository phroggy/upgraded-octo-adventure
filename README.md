[upgraded-octo-adventure](https://secret-dusk-50437.herokuapp.com/)
===================================================================

:octopus: :octopus: :octopus:

Getting Started
---------------

### Prerequisites
Install MongoDB:
```bash
$ brew install mongodb
$ brew services start mongodb
$ echo MONGODB_URI=mongodb://localhost:27017/ >> .env
```

Install dependencies:

```bash
$ npm install
```

### Run Locally

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

Authors
-------

* **[Cameron Leach](https://github.com/phroggy)**
* **[Ellie Hoshizaki](https://github.com/elliehoshi)**
