const functions = require('firebase-functions');
    lib = require('./lib');

const nodemailer = require('nodemailer');
const {gmailPassword} = require('../fire/config.js')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jointriphub@gmail.com',
        pass: gmailPassword
    }
});

// const sendmail = require('sendmail')();


// const sendInvite = (email, tripId) => {
//     console.log('inside of sendInvite', email, tripId);
//     return sendmail({
//         from: 'joinatrip@triphub.notasite',
//         to: email,
//         subject: `You've been invited to join a trip!`,
//         html: `Start a new trip with your friends using TripHub. \n \n Please sign up or login at triphub.herokuapp.com. Then go to triphub.herokuapp.com/${tripId}`,
//     }, function (err, reply) {
//         console.log('err and reply inside of sendInvite ---->', err, reply);
//         console.log(err && err.stack);
//         console.dir(reply);
//     });
// };


exports.helloWorld = functions.https.onRequest((request, response) =>
   response.send(lib));

exports.bot = functions.firestore
    .document('trips/{tripId}/chat/{messageId}')
    .onCreate(lib.runBotFromMessageEvent()); //pass in tripId

/*
➜  $ firebase experimental:functions:shell

firebase > bot({from: 'annelise', text: '/search for HI'}, {params: {tripId: '5TT8NzzvNVZAvd8SbEyQ'}})
*/

exports.sendInvite = functions.firestore
    .document('/invites/{inviteId}')
    .onCreate(event => {

        var {email, tripName, displayName} = event.data.data();
        var inviteId = event.data.id;

        console.log('getting information inside of sendInvite cloud function ', email, tripName, displayName, inviteId)

        const mailOptions = {
            from: 'jointriphub@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'You\'ve been invited to join a trip!', // Subject line
            html: `<p>${displayName} invited you to join their trip: ${tripName}</p><p>Go to https://www.capstone-98fe9.firebaseapp.com/join/${inviteId} to start planning.</p><p>Have a great trip!</p>`// plain text body
        };

        return transporter.sendMail(mailOptions, function (err, info) {
            if (err) {console.log(err)}
            else {console.log(info)}
        });

    });





    // .document('/users/{userId}')
    // .onUpdate(event => {
    //     console.log('***********got event and event.data and event.data.data()', event.data);

    //     const {invitee, tripId} = event.data.data();
    //     console.log('invitee is: ', invitee);

    //     if (invitee === '') {
    //         console.log('thinks invitee is blank: ');
    //         return;
    //     }
    //     return sendInvite(invitee, tripId);
    //     // return event.data.set({invitee: '', tripId: ''}, {merge: true});
    // });

