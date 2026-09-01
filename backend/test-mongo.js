const mongoose = require('mongoose');

const uri = 'mongodb://MbkLms:Nithya1234@ac-jxsqbhi-shard-00-00.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-01.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-02.phfi4bf.mongodb.net:27017/mbklms?ssl=true&replicaSet=atlas-7vrrxb-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:');
    console.error(err);
    process.exit(1);
  });
