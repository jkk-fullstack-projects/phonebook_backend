const personsRouter = require('express').Router();
const Person = require ('../models/person');

personsRouter.get('/', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => {
      response.status(500).json({ error: 'Internal server error' });
    });
});

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404)
          .send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

personsRouter.get('/info', (request, response, next) => {
  const date = new Date();
  Person
    .find({}).then(data => {
      response.send(
        `<p>Phonebook has info for ${data.length} people ${date}<p>`
      );
    })
    .catch(error => next(error));
});

function createPerson(body) {
  return new Person({
    name: body.name,
    number: body.number,
  });
}

const validatePerson = (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'content is missing' });
  }
  Person.findOne({ name: name })
    .then(foundPerson => {
      if (foundPerson) {
        return response.status(409).json({ error: 'name already exists' });
      } else {
        // If no person with the name exists, proceed to the next middleware or function
        next();
      }
    })
    .catch(error => next(error));
};

personsRouter.post('/',validatePerson, (request, response) => {
  const body = request.body;
  const newPerson = createPerson(body);

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
      } else {
        //console.error('Unexpected error: ', error)
        return response.status(500).json({ error: 'Internal server error' });
      }
    });
});

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        const errorMessage = 'Person not found';
        response.status(404).json({ error: errorMessage });
      }
    })
    .catch(error => next(error));
});

personsRouter.put('/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

module.exports = personsRouter;