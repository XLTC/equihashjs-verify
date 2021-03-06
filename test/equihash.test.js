var assert = require('assert');
var Equihash = require('../src/equihash')
var NETWORKS = require('../src/networks')
var fixtures = require('./equihash.fixtures')

describe('Equihash', function () {
    'use strict'
    
    describe('Verify', function () {
        beforeEach(function () {
            this.equihash = new Equihash(NETWORKS.bitcoingold)
        });

        fixtures.valid.forEach(fixture => {
            it('should return true when valid ' + fixture.description, function () {
                let valid = false
                if (fixture.nonce) {
                    valid = this.equihash.verify(Buffer.from(fixture.header, 'hex'), Buffer.from(fixture.solution, 'hex'), Buffer.from(fixture.nonce, 'hex'))
                } else {
                    valid = this.equihash.verify(Buffer.from(fixture.header, 'hex'), Buffer.from(fixture.solution, 'hex'))
                }

                assert.ok(valid);
            });
        });

        fixtures.invalid.forEach(fixture => {
            it('should return false when not valid ' + fixture.description, function () {
                let valid = true

                // Node < 8 - buffer throw exception when wrong hex
                try {
                    let header = Buffer.from(fixture.header, 'hex'),
                    solution =  Buffer.from(fixture.solution, 'hex'),
                    nonce = fixture.nonce ? Buffer.from(fixture.nonce, 'hex') : null

                    valid = this.equihash.verify(header, solution, nonce)
                } catch(ex) {
                    console.log(ex)
                    valid = false;
                }
                
                assert.ok(!valid);
            });
        });

        fixtures.exception.forEach(fixture => {
            it('should throw exception when ' + fixture.description, function () {
                try {
                    if (fixture.nonce) {
                        this.equihash.verify(Buffer.from(fixture.header, 'hex'), Buffer.from(fixture.solution, 'hex'), Buffer.from(fixture.nonce, 'hex'))
                    } else {
                        this.equihash.verify(Buffer.from(fixture.header, 'hex'), Buffer.from(fixture.solution, 'hex'))
                    }
                } catch (ex) {
                    assert.ok(ex != null);
                    return
                }

                assert.fail();
            });
        });
    });
});
