# Alexa-skill-for-showcase-event
This project covering creating amazon Alexa skill that collect visitors opinion about brunel showcase , their best project, the project rate and thanks and add all data to dynamoDB database

you need to zip the files index.js plus the folder node_modules, you can get the nodel_module folder by running the following 
commands in the termial:
1.create a folder called alexa_skill  in your desktop
2. cd Desktop/
3. cd alexa_skill
4. create npm project by typing the following in the terminal:
4.1 npm init
4.2 fill the data for json file such as project name, version, keywords, authors, etc . type yes as answer to confriamtion question. // you will find the json file is created and placed in your alexa_skill folder that you created previously
//install the dependencies files, they are shown in package.json file 
4.3 . npm install alexa-sdk –save 
4.4 npm install aws-sdk - -save
you will find a folder called node_modules created in your folder.
5. zip the folder node_modules and index.js and upload them to lambda function in amazon 
6. to share your project with others, you need to upload only the index.js and package.json file. 
// all the depndencies you need to install will be listed in package.json , so you can create the node_module 
by doing steps 4 , 4.1, 4.2, 4.3, 4.4


