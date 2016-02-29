# Hunt

Hunt helps you track your progress through the job search! Stay on top of the job listings you're interested in, and move your application through the stages (application submitted, phone screen, interview) on the way to a dope job offer.

With Hunt, you can:

  - track job positions you want to research
  - schedule phone screens and interviews
  - remember the location of an on-site interview
  - track notes for each stage (i.e. an offer's benefits package)
  - compare positions at the same stage by which has the most pressing deadline, or sort your offers by highest salary

## Team

  - __Product Owner__: Albert Huynh
  - __Scrum Master__: Akshay Buddiga
  - __Development Team Members__: Gar Lee, Alex Chou

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    2. [Tasks](#tasks)
4. [Team](#team)
5. [Contributing](#contributing)

## Usage

This project was built as part of Hack Reactor 39, and the codebase is open source (with attribution) under the ISC license. To get started, take a look at [Development](#development).

## Requirements

- Node 0.10.x
- Postgresql 9.5.x

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Tasks
Fork the repo to your local branch. When you've cloned down to your local machine, install the dependencies by following the instructions [here](#installing-dependencies), and verify you have all the required software listed [here](#requirements).

Open Postgres in your terminal and create databases named 'hunt' and 'hunttest'. The 'hunt' db is the real db, while 'hunttest' is used during testing.

Run `grunt start` or `nodemon app.js` in the root folder to start the app. You may need to run it a couple times at first so that all the db tables are created with the correct relations.

To run tests, run `grunt test` or `npm test`. Again, you may need to run it a couple times at first so that the db tables in the test db are created properly.

If you make changes to client side code in the app folder, run `grunt build` to re-run the build processes. The changes will then show up in your app. You can also run `grunt watch` to have Grunt watch for changes automatically.

### Roadmap

View the project roadmap [here](https://github.com/artisanal-loofah/artisanal-loofah/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.