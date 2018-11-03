import { ConfigParams } from 'pip-services3-commons-node';

import { FluentdLogger } from '../../src/log/FluentdLogger';
import { LoggerFixture } from '../fixtures/LoggerFixture';

suite('FluentdLogger', ()=> {
    let _logger: FluentdLogger;
    let _fixture: LoggerFixture;

    setup((done) => {
        let host = process.env['FLUENTD_SERVICE_HOST'] || 'localhost';
        let port = process.env['FLUENTD_SERVICE_PORT'] || 24224;

        _logger = new FluentdLogger();
        _fixture = new LoggerFixture(_logger);

        let config = ConfigParams.fromTuples(
            'source', 'test',
            'connection.host', host,
            'connection.port', port
        );
        _logger.configure(config);

        _logger.open(null, done);
    });

    teardown((done) => {
        _logger.close(null, done);
    });

    test('Log Level', () => {
        _fixture.testLogLevel();
    });

    test('Simple Logging', (done) => {
        _fixture.testSimpleLogging(done);
    });

    test('Error Logging', (done) => {
        _fixture.testErrorLogging(done);
    });

});