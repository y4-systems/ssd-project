// const bcrypt = require('bcrypt');

// const password = 'p123';

// bcrypt.hash(password, 10, function(err, hash) {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(hash);
//     }
// });


const bcrypt = require('bcrypt');

const password = 'p123';
const saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) {
        console.error(err);
    } else {
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.error(err);
            } else {
                console.log(hash);
            }
        });
    }
});
