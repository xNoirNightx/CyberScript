const { Schema, model } = require('mongoose');
const userMessagesSchema = require('./userMessagesSchema');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(

  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    avatar: {
      type: String,
    },
    messages: [userMessagesSchema]
    //streak: {
    //type: Decimal
    //}
    //xp: [xp],
    //achievements: [achievements],
    // to add progress tracking, i have a few ideas. we could add it based on the user's xp.
    // each lesson provides x amount of xp which adds up to a totoal of the whole course material
    // or we can track how many lessons the user has completed.
    // but it is the end of my lunch so i'll discuss later.

  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;

/*
userSchema
    username
    email
    password
    avatar?
    xp?
    achievements

// hash the password??

achievementSchema
    name
    image?
/

unitSchema
    name
    [Lessons]

lessonSchema
    name
    
    [Questions]

questionsSchema
    name
    type
    question
    [Answers]

answersSchema
    correct_answer
    answers
    // encrypt correct answer?

authSchema
    token
    user

*/
