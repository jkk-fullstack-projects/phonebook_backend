const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
morgan.token('body', (request) => JSON.stringify(request.body));

app.use(express.json());
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'))

let  persons = [
    { 
        "name": "Artoo DeeToo", 
        "number": "040-123456",
        "id": 1
    },
    { 
        "name": "Bryan Baddington", 
        "number": "050-5323523",
        "id": 2
    },
    { 
        "name": "Charlye Chalamé", 
        "number": "121-121121",
        "id": 3
    },
    { 
        "name": "Davide DaVide", 
        "number": "0500-05005005",
        "id": 4
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World from persons!</h1>');
});
  
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get('/api/info', (request, response) => {
    let PhonebookSize = persons.length;
    response.send(`Phonebook has info for ${PhonebookSize} people</br>
    ${Date()}`);
})

function generateId() {
    const max = 10000000;
    return Math.floor(Math.random() * max);
}

function personExists(name) {
    return persons.some(person => person.name === name);
}

function createPerson(body){
    return {
            name: body.name,
            number: body.number,
            id: generateId()
    };
}

const validatePerson = (request, response, next) => {
    const {name, number } = request.body
    
    if (!name || !number){
        return response.status(400).json({error: 'content is missing'});
    }

    if (personExists(name)) {
        return response.status(409).json({ error: 'resource exists'});
    }

    next();
};

app.post('/api/persons',validatePerson, (request, response) => {
    const body = request.body;
    const newperson = createPerson(body);
    persons = persons.concat(newperson);
    response.json(newperson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
