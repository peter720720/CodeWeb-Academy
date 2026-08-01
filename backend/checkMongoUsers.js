import mongoose from 'mongoose';

const uri = 'mongodb+srv://oyinloyepeter273_db_user:MRWRi3C4xA5wzHaJ@cluster0.kp6khjh.mongodb.net/codeweb_db?appName=Cluster0';

const schema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', schema, 'users');

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const users = await User.find({}, { email: 1, fullName: 1, role: 1, selectedCourse: 1 }).lean();
    console.log('users count', users.length);
    console.log(JSON.stringify(users.slice(-10), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
