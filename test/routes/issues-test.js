process.env.NODE_ENV = 'test';

let issues = require('../../models/issues');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

var mongoose = require("mongoose");


chai.use(chaiHttp);
chai.use(require('chai-things'));
let _ = require('lodash' );

describe('Issues', function () {
    before(function (done) {
        issues.collection.drop();
        done();
    })
    beforeEach(function (done) {
        var issue1 = new issues({
            status: false,
            solutions: [],
            _id: "5bcf4dbd1e8bb84d200597fc",
            category: "Art",
        })
        issue1.save(function(){
            done();
        });
    })
    beforeEach(function (done) {
        var issue2 = new issues({
            status: false,
            solutions: [],
            _id: "5bcf4dbf1e8bb84d200597fd",
            category: "Art",
        })
        issue2.save(function(){
            done();
        });
    })
    beforeEach(function (done) {
        var issue3 = new issues({
            status: false,
            solutions: [
                "5bcf4def1e8bb84d20059800",
                "5bcf4df21e8bb84d20059802"
            ],
            _id: "5bcf4dc71e8bb84d200597fe",
            category: "Business",
        })
        issue3.save(function(){
            done();
        });
    })



    describe('GET /issues', () => {
        it('should return all the issues in an array', function (done) {
            chai.request(server)
                .get('/issues')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (issue) => {
                        return {
                            id: issue._id,
                            category: issue.category
                        }
                    });
                    expect(result).to.include({id: "5bcf4dbd1e8bb84d200597fc", category: 'Art'});
                    expect(result).to.include({id: "5bcf4dbf1e8bb84d200597fd", category: 'Art'});
                    expect(result).to.include({id: "5bcf4dc71e8bb84d200597fe", category: 'Business'});
                    done();
                });
        });
    });

    describe('GET /issues/:id', () => {

        it('should return one issue with certain id', function (done) {
            chai.request(server)
                .get('/issues/5bcf4dbd1e8bb84d200597fc')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    let result = _.map(res.body, (issue) => {
                        return {_id: issue._id}
                    });
                    expect(result).to.include({_id: "5bcf4dbd1e8bb84d200597fc"});
                    done();
                })
        })
        it('should return err when request id is invalid', function (done) {
            chai.request(server)
                .get('/issues/10000000')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'Issue Not Found!');
                    done();
                })
        })
    })

    describe('GET/issues/category/:category', () => {
        it('should return all issues in certain category in array', function (done) {
            chai.request(server)
                .get('/issues/category/AR')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (issue) => {
                        return {
                            id: issue._id,
                            category: issue.category
                        }
                    });
                    expect(result).to.include({id: "5bcf4dbd1e8bb84d200597fc", category: 'Art'});
                    expect(result).to.include({id: "5bcf4dbf1e8bb84d200597fd", category: 'Art'});
                    done();
                })
        })
        it('should return err when request category is invalid', function (done) {
            chai.request(server)
                .get('/issues/category/ABC')
                .end(function (err, res) {
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(0);
                    done();
                })
        })
    })

    describe('GET/issues/solved/status',()=> {
        it('should return all issues with certain status in array', function (done) {
            chai.request(server)
                .get('/issues/solved/0')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (issue) => {
                        return {
                            id: issue._id,
                            status: issue.status
                        }
                    })
                    expect(result).to.include({id: "5bcf4dbd1e8bb84d200597fc", status: false});
                    expect(result).to.include({id: "5bcf4dbf1e8bb84d200597fd", status: false});
                    expect(result).to.include({id: "5bcf4dc71e8bb84d200597fe", status: false});
                    done();
                })
        })
        it('should return 404 when request status is illegal', function (done) {
            chai.request(server)
                .get('/issues/solved/2')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        })
    })

    describe('PUT/issues/:id/:status',()=>{
        it('should update the status and display the modified issue',function (done) {
            chai.request(server)
                .put('/issues/5bcf4dbd1e8bb84d200597fc/1')
                .end(function (err,res) {
                    expect(res.body).to.have.property('message', 'Issue Successfully Set Solved!');
                    expect(res.body.data).to.have.property('status',true);
                    done();
                })
        })
        after(function (done) {
            chai.request(server)
                .put('/issues/5bcf4dbd1e8bb84d200597fc/0')
                .end(function (err) {
                    done();
                })
        })
        it('should return an error message when id is invalid',function (done) {
            chai.request(server)
                .put('/issues/100000000/1')
                .end(function (err,res) {
                    expect(res.body).to.have.property('message', 'Donation NOT Found!');
                    done();
                })
        })
        it('should return an error message when status is illegal',function (done) {
            chai.request(server)
                .put('/issues/5bcf4dbd1e8bb84d200597fc/2')
                .end(function (err,res) {
                    expect(res.body).to.have.property('message', 'Issue NOT Updated to Solved!');
                    done();
                })
        })
    })

    describe('DELETE/issues/:id',()=>{
        before(function (done) {
            issues.collection.drop();
            done();
        })
        it('should return an error message when id is invalid',function (done) {
            chai.request(server)
                .delete('/issues/10000000')
                .end(function (err,res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'Issue NOT DELETED!');
                    done();
                })
        })
        it('should return a message when a issue is deleted',function (done) {
            chai.request(server)
                .delete('/issues/5bcf4dbd1e8bb84d200597fc')
                .end(function (err,res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Issue Successfully Deleted!');
                    done();
                })
        })
        after(function (done) {
            chai.request(server)
                .get('/issues')
                .end(function (err,res) {
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (issue) => {
                        return {_id: issue._id}
                    });
                    expect(result).to.not.include({id: "5bcf4dbd1e8bb84d200597fc"});
                    done();
                })
        })
    })

    describe('POST/issues',()=>{
        it('should return a message when an issue is successfully added',function (done) {
            let issue = {
                _id: "5bd1ef71a7acc445686cc0e1",
                category: 'Academy' ,
                status: 0,
                solutions: []
            };
            chai.request(server)
                .post('/issues')
                .send(issue)
                .end(function (err,res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Issue Successfully Added!');
                    done();
                })
            after(function (done) {
                chai.request(server)
                    .get('/issues')
                    .end(function (err,res) {
                        expect(res.body.length).to.equal(4);
                        done();
                    })
            })
        })
    })


})
