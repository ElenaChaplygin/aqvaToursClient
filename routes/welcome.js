/**
 * Created by Ignat on 8/12/2015.
 */

exports.get = function(req, res) {
    res.render('welcome',{ title: 'Welcome page', welcomeMessage: 'Welcome to AqvaTours CRM!' });
};