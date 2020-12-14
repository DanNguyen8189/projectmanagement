# projectmanagement

deployed at https://projectmanagement157.herokuapp.com/

## Deploying in Heroku after developing on Repl.it

1. in index.js, make sure to change to app.listen(3000, () => console.log('server started'));
to app.listen(process.env.PORT || 3000, () => console.log('server started')); 
2. If using any tokens somewhere in code, change them env variables
3. create and use env variables for the mongodb information in database.js
4. download app as zip, then unzip
5. manually recreate the package.json file because the download as zip doesn't download it
6. rename the downloaded index.js to server.js because that's what Heroku will look for. After doing this, 
also make sure to note the change in the package.json file too! (the "main" field) 
7. create app on heroku and follow the steps there for using the Heroku CLI with the cmd prompt
8. remember to set the env variables that you defined before (Go to your app on Heroku -> settings -> config vars)!
