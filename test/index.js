import chai from 'chai';
import fs from 'fs';
import { GCodeInterpreter } from '../lib/';

const expect = chai.expect;
const should = chai.should();

describe('G-code Interpreter', () => {
    describe('Pass a null value as the first argument', () => {
        class GCodeRunner extends GCodeInterpreter {
            constructor(options) {
                super(options);
            }
        }

        const runner = new GCodeRunner();
        it('should call loadFromString\'s callback.', (done) => {
            runner.loadFromString(null, (err, results) => {
                expect(err).to.be.equal(null);
                done();
            });
        });
        it('should call loadFromFile\'s callback.', (done) => {
            runner.loadFromFile(null, (err, results) => {
                expect(err).not.to.equal(null);
                done();
            });
        });
        it('should call loadFromStream\'s callback.', (done) => {
            runner.loadFromStream(null, (err, results) => {
                expect(err).not.to.equal(null);
                done();
            });
        });
    });

    describe('Event listeners', () => {
        it('should call event listeners when loading G-code from file.', (done) => {
            const file = 'test/fixtures/circle.nc';
            const runner = new GCodeInterpreter();

            runner
                .loadFromFile(file, (err, results) => {
                    expect(err).to.be.okay;
                    done();
                })
                .on('data', (data) => {
                    expect(data).to.be.an('object');
                })
                .on('end', (results) => {
                    expect(results).to.be.an('array');
                    expect(results.length).to.be.equal(7);
                });
        });

        it('should call event listeners when loading G-code from stream.', (done) => {
            const stream = fs.createReadStream('test/fixtures/circle.nc');
            const runner = new GCodeInterpreter();

            runner
                .loadFromStream(stream, (err, results) => {
                    expect(err).to.be.okay;
                    done();
                })
                .on('data', (data) => {
                    expect(data).to.be.an('object');
                })
                .on('end', (results) => {
                    expect(results).to.be.an('array');
                    expect(results.length).to.be.equal(7);
                });
        });

        it('should call event listeners when loading G-code from string.', (done) => {
            const string = fs.readFileSync('test/fixtures/circle.nc', 'utf8');
            const runner = new GCodeInterpreter();

            runner
                .loadFromString(string, (err, results) => {
                    expect(err).to.be.okay;
                    done();
                })
                .on('data', (data) => {
                    expect(data).to.be.an('object');
                })
                .on('end', (results) => {
                    expect(results).to.be.an('array');
                    expect(results.length).to.be.equal(7);
                });
        });

        it('loadFromFileSync() should return expected result.', (done) => {
            let i = 0;
            const file = 'test/fixtures/circle.nc';
            const runner = new GCodeInterpreter();
            const results = runner.loadFromFileSync(file, (data, index) => {
                expect(i).to.be.equal(index);
                ++i;
            });
            expect(results).to.be.an('array');
            expect(results.length).to.be.equal(7);
            done();
        });

        it('loadFromStringSync() should return expected result.', (done) => {
            let i = 0;
            const file = 'test/fixtures/circle.nc';
            const string = fs.readFileSync(file, 'utf8');
            const runner = new GCodeInterpreter();
            const results = runner.loadFromStringSync(string, (data, index) => {
                expect(i).to.be.equal(index);
                ++i;
            });
            expect(results).to.be.an('array');
            expect(results.length).to.be.equal(7);
            done();
        });
    });

    describe('G-code: circle (calls GCodeInterpreter)', () => {
        it('should call each function with the expected number of times.', (done) => {
            const calls = {};

            class GCodeRunner {
                loadFile(file, callback) {
                    const handlers = {
                        'G0': (args) => {
                            calls.G0 = (calls.G0 || 0) + 1;
                            expect(args).to.be.an('object');
                        },
                        'G1': (args) => {
                            calls.G1 = (calls.G1 || 0) + 1;
                            expect(args).to.be.an('object');
                        },
                        'G2': (args) => {
                            calls.G2 = (calls.G2 || 0) + 1;
                            expect(args).to.be.an('object');
                        }
                    };

                    const interpreter = new GCodeInterpreter({ handlers: handlers })
                    interpreter.loadFromFile(file, callback);

                    return interpreter;
                }
            };

            new GCodeRunner().loadFile('test/fixtures/circle.nc', (err, results) => {
                expect(calls.G0).to.equal(2);
                expect(calls.G1).to.equal(1);
                expect(calls.G2).to.equal(4);
                done();
            });
        });
    });

    describe('G-code: circle (extends GCodeInterpreter)', () => {
        const calls = {};

        class GCodeRunner extends GCodeInterpreter {
            constructor(options) {
                super(options);
            }
            G0(args) {
                calls.G0 = (calls.G0 || 0) + 1;
                expect(args).to.be.an('object');
            }
            G1(args) {
                calls.G1 = (calls.G1 || 0) + 1;
                expect(args).to.be.an('object');
            }
            G2(args) {
                calls.G2 = (calls.G2 || 0) + 1;
                expect(args).to.be.an('object');
            }
        }

        it('should call each function with the expected number of times.', (done) => {
            const file = 'test/fixtures/circle.nc';
            const string = fs.readFileSync(file, 'utf8');
            const runner = new GCodeRunner();
            runner.loadFromFileSync(file);
            expect(calls.G0).to.equal(2);
            expect(calls.G1).to.equal(1);
            expect(calls.G2).to.equal(4);
            runner.loadFromStringSync(string);
            expect(calls.G0).to.equal(2 * 2);
            expect(calls.G1).to.equal(1 * 2);
            expect(calls.G2).to.equal(4 * 2);
            done();
        });
    });

    describe('G-code: 1 inch circle', () => {
        const calls = {};

        class GCodeRunner extends GCodeInterpreter {
            constructor(options) {
                super(options);
            }
            G17() {
                calls.G17 = (calls.G17 || 0) + 1;
            }
            G20() {
                calls.G20 = (calls.G20 || 0) + 1;
            }
            G90() {
                calls.G90 = (calls.G90 || 0) + 1;
            }
            G94() {
                calls.G94 = (calls.G94 || 0) + 1;
            }
            G54() {
                calls.G54 = (calls.G54 || 0) + 1;
            }
            G0(args) {
                expect(args).to.be.an('object');
                calls.G0 = (calls.G0 || 0) + 1;
            }
            G1(args) {
                expect(args).to.be.an('object');
                calls.G1 = (calls.G1 || 0) + 1;
            }
            G2(args) {
                expect(args).to.be.an('object');
                calls.G2 = (calls.G2 || 0) + 1;
            }
        }

        it('should call each function with the expected number of times.', (done) => {
            const file = 'test/fixtures/one-inch-circle.nc';
            const string = fs.readFileSync(file, 'utf8');
            const runner = new GCodeRunner();
            runner.loadFromFileSync(file);
            expect(calls.G0).to.equal(4);
            expect(calls.G1).to.equal(2);
            expect(calls.G2).to.equal(4);
            runner.loadFromStringSync(string);
            expect(calls.G0).to.equal(4 * 2);
            expect(calls.G1).to.equal(2 * 2);
            expect(calls.G2).to.equal(4 * 2);
            done();
        });
    });

});
