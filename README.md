# projectmanagement

deployed at https://projectmanagement157.herokuapp.com/

This is a MEAN full stack application! This is a project management app, where admin members can create projects and their milestones 
for clients to view and approve.

#### Admin View: 

Admin can create projects for their clients. Each project will be assigned a client code that the client can use to access it later.
Admin can add multiple milestones to each project, to be approved by the client.

#### Client View:
Client can use their client code to log in and view their project. Clients can approve milestones that the admin included with 
that project.


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
