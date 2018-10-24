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
})
