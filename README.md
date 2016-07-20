# Declarative Workshop

This workshop is designed to help understand the differences between programming in an imperative and declarative style

Inside the imperative style functions please try to use explicit for loops like

```
for(let i = 0: i < data.length; i++) {

}
```
For the Declarative style functions we will use a library called Ramda. Docs can be found here
```
http://ramdajs.com/0.21.0/docs/
```

## Setup instructions
Make sure you have Docker for Mac
```
https://download.docker.com/mac/beta/Docker.dmg
```
Make sure you have nvm installed
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
```
Install the right version of node
```
nvm install v6.2.2
```
Install the project
```
git clone git@github.com:timcash/declarative_workshop_2.git
cd declarative_workshop_2
nvm use
npm start
```

You should see output from docker downloading and installing everything from the workshop.
