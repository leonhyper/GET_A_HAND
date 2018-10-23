process.env.NODE_ENV = 'test';

let datastore = require('../../models/issues');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

var mongoose = require("mongoose");


chai.use(chaiHttp);
chai.use(require('chai-things'));
let _ = require('lodash' );

describe('Issues', function (){
    beforeEach(function(){
        var datastore =[];
        while(datastore.length > 0) {
            datastore.pop();
        }
        datastore.push(
            {_id: "5bcdfa555b85ea05a8ad43a9", category: 'Art', status: false, soluitons: []}
        );
        datastore.push(
            {_id: "5bcdfa6d5b85ea05a8ad43ab", category: 'Business', status: false, soluitons: []}
        );
        datastore.push(
            {_id: "5bcdfa615b85ea05a8ad43aa", category: 'Academy', status: false, soluitons: []}
        );
    });

    describe('GET /issues',  () => {
        it('should return all the issues in an array', function(done) {
            chai.request(server)
                .get('/issues')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (issue) => {
                        return { id: issue._id,
                            category: issue.category }
                    });
                    expect(result).to.include( { id: "5bcdfa555b85ea05a8ad43a9", category: 'Art'  } );
                    expect(result).to.include( { id: "5bcdfa615b85ea05a8ad43aa", category: 'Academy'  } );
                    expect(result).to.include( { id: "5bcdfa6d5b85ea05a8ad43ab", category: 'Business'  } );
                    done();
                });
        });
    });
});
