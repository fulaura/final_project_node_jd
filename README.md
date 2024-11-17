------------------------------------------------------------------
# Project

# Project info
# I will use comments in my code snippets to explain/show my codes
------------------------------------------------------------------
### Project setup

TODO:
### step 1: Download Ganache to simulate blockchain environment--- [Ganache](https://www.trufflesuite.com/ganache)
### step 2: run these commands
0: install dependencies
npm install

1.1: deploy contracts
npx truffle migrate --network development

1.2: if you have made changes in contract or migration files
npx truffle migrate --reset --network development

### step 3: setup your MongoDB

2: modemon server

------------------------------------------------------------------


I have comented HTML files, but not many js files commented. They are too long, for this reason i think it is good to defend it inforont of you.
ALso, I used blockchain, you can see them in contracts page. And they were deployed by migrations files.

I think there is no need to explain from point ot point because tasks as same as the previous assignments.

NOTE: my image retrieve is buggy, so it cant show you the images

NOTE2: if you do not setup properly these files, they do not work, because they are set up for local run.
# TODO: ===mongodb:final_project connection, fin_proj_profile database, and (accounts, fulaura_news, profile) collections===




Requirements////
------------------------------------------------------------------
REQ 0:
REQ 0:
+ Original work     (used blockchain)
+ Server port 3000
+ Mongo DB
+ Nav bar
+ Readme exists
+ Footer is made


*************************

Authentication & Auth

*************************
User Registration:
+ Using following fields {username, password, first name, last name, age, email}
+ 2FA is set up
+ Hashing had been used
- Welcome Message by using Nodemailer

# User Login:
+ Login page(usrnm & pwd)
+ 2FA used for verification
+ Redirect auth-ed users to main page

# Authorization:
+ Implement role based access control    (admin/moderator/user)
+ Admins have control over records
+ Store and check users role by storing it in db

# Security:
+ Passwords are hashed, 2FA used
+ token based session


*************************
# Portfolio Management (CRUD Operations):
+ Develop a portfolio page that displays portfolio which is created by admin or user

# Item REQ:
+ Carouel
+ Allow admins to create/delete records
+ moderators have limited access to features

# API Integration and Visualization:
+ use 3rd-party APIs
+ done visualization on sever pages

# Messaging and Notifications with Nodemailer:
-None of these requirements satisfied(nodemailer)

*************************
# Project Organization and Design
+ Clean code
+ Responsive Dasign and UI
+ Documentation


