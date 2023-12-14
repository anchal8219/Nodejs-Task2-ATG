// const mongoose = require("mongoose");

// const connDB = async () => {
//   const uri = process.env.MONGODB_URL;

//   try {
//     await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error.message);
//   }
// };

// module.exports = { connDB };


const mongoose = require("mongoose");

const connDB = async () => {
  const uri = process.env.MONGODB_URL;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,    // Remove this line (deprecated)
      useUnifiedTopology: true // Remove this line (deprecated)
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = { connDB };
