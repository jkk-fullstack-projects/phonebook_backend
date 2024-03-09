const mongoose = require('mongoose')

const password = process.argv[2];

const url = `mongodb+srv://fullstackPhone:${password}@cluster0.lrdagse.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String,
});

const Person = mongoose.model('Person', personSchema);

function show_all_persons() { Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
        mongoose.connection.close()
    });
};

function add_person_to_database() {
    const person = new Person({
        "name": process.argv[3].toString(),
        "number": process.argv[4].toString(),
    });

    person.save().then(result => {
        console.log('person saved to database!');
        mongoose.connection.close();
    });
};

if (process.argv.length<3) {
    console.log('give password as argument');
    process.exit(1);
} else if (process.argv.length > 5){
    console.log('Please check that the name and number are in quotes!');
    process.exit(1);
} else if (process.argv.length === 3){
    show_all_persons();
} else {
    add_person_to_database();
};