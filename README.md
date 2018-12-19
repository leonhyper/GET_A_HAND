SHENG ZHU WIT20082253

FUNCTION DESCRIPTION
GET
'/issues', issues.findAllIssues: get all issues in database;

'/issues/:id', issues.findById: search for one issue by its _id;

'/issues/category/:category', issues.findByCate: get all issues with certain category(fuzzy search adopted);

'/issues/solved/:status', issues.findByStatus: get all issues with one status solved(1 or True) or unsolved(0 or False);

'/issues/one/:id', issues.findOne: get one issue with accurate _id;

'/solutions', issues.findAllSolutions: get all solutions in database;

'/solutions/:id', issues.findSolutionsById: search for one solution by its solutionId;

'/solutions/:id/parent', issues.getParentIssue: get one solution's parent issue by its solutionId;

'/issues/:id/solutions', issues.findByParent: get one issue and all its solutions by its _id;

'/parent/:pid', issues.findByPid: get all the solutions under one parent issue;

POST
'/issues', issues.addIssue: add a new issue to database;

'/solutions', issues.addSolution: add a new solution to database and to one issue;

'/user/register', user.register: create a new account;

'/user/validate/:name/:pass', user.validate: athenticate user name and pass when logging in;

'/user/validateName/:name', user.validateName: check if the username is already taken up in database when signing up;

PUT
'/issues/:id/:status', issues.updateStatus: update one issue's status,set it to true or false;

'/solutions/:id/like', issues.increaseLike: increase one solution's like property by 1;

DELETE
'/issues/:id', issues.deleteIssue: delete one issue by its _id;

'/solutions/:id', issues.deleteSolution: delete one solution by its solutionId;

PERSISTANCE APPROACH
Data of two models-issues and solutions- are stored in mongoDB and set up on mlab.

GitHub 
git project link: https://github.com/leonhyper/GET_A_HAND.git

REFERENCES
1.MONGOOSE OFFICIAL GUIDE DOCS: https://mongoosejs.com/docs/guide.html

2.Node.js v8.12.0 Documentation: https://nodejs.org/dist/latest-v8.x/docs/api/

3.JavaScript 参考手册: http://www.w3school.com.cn/jsref/index.asp

4.Donationweb developed by David Drohan, WIT
