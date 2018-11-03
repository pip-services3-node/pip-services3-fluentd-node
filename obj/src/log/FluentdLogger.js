"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
/**
 * Logger that dumps execution logs to Fluentd service.
 *
 * Fluentd is a popular logging service that is often used
 * together with Kubernetes container orchestrator.
 *
 * Authentication is not supported in this version.
 *
 * ### Configuration parameters ###
 *
 * - level:             maximum log level to capture
 * - source:            source (context) name
 * - connection(s):
 *     - discovery_key:         (optional) a key to retrieve the connection from [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:              connection protocol: http or https
 *     - host:                  host name or IP address
 *     - port:                  port number
 *     - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *     - interval:        interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:  maximum number of messages stored in this cache (default: 100)
 *     - reconnect:       reconnect timeout in milliseconds (default: 60 sec)
 *     - timeout:         invocation timeout in milliseconds (default: 30 sec)
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>   (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/info.contextinfo.html ContextInfo]] to detect the context id
 *                                              and specify counters source
 * - <code>\*:discovery:\*:\*:1.0</code>      (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * ### Example ###
 *
 *     let logger = new FluentdLogger();
 *     logger.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 24224
 *     ));
 *
 *     logger.open("123", (err) => {
 *         ...
 *     });
 *
 *     logger.error("123", ex, "Error occured: %s", ex.message);
 *     logger.debug("123", "Everything is OK.");
 */
class FluentdLogger extends pip_services3_components_node_1.CachedLogger {
    /**
     * Creates a new instance of the logger.
     */
    constructor() {
        super();
        this._connectionResolver = new pip_services3_rpc_node_1.HttpConnectionResolver();
        this._reconnect = 10000;
        this._timeout = 3000;
        this._client = null;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._connectionResolver.configure(config);
        this._reconnect = config.getAsIntegerWithDefault('options.reconnect', this._reconnect);
        this._timeout = config.getAsIntegerWithDefault('options.timeout', this._timeout);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        super.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._timer != null;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this.isOpen()) {
            callback(null);
            return;
        }
        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (connection == null)
                err = new pip_services3_commons_node_1.ConfigException(correlationId, 'NO_CONNECTION', 'Connection is not configured');
            if (err != null) {
                callback(err);
                return;
            }
            let host = connection.getHost();
            let port = connection.getPort() || 24224;
            let options = {
                host: host,
                port: port,
                timeout: this._timeout / 1000,
                reconnectInterval: this._reconnect
            };
            this._client = require('fluent-logger');
            this._client.configure(null, options);
            this._timer = setInterval(() => { this.dump(); }, this._interval);
            if (callback)
                callback(null);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        this.save(this._cache, (err) => {
            if (this._timer)
                clearInterval(this._timer);
            this._cache = [];
            this._timer = null;
            this._client = null;
            if (callback)
                callback(null);
        });
    }
    /**
     * Saves log messages from the cache.
     *
     * @param messages  a list with log messages
     * @param callback  callback function that receives error or null for success.
     */
    save(messages, callback) {
        if (!this.isOpen() || messages.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        for (let message of messages) {
            let record = {
                level: message.level,
                source: message.source,
                correlation_id: message.correlation_id,
                error: message.error,
                message: message.message
            };
            this._client.emit(message.level, record, callback);
        }
    }
}
exports.FluentdLogger = FluentdLogger;
//# sourceMappingURL=FluentdLogger.js.map