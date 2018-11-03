/** @module log */
import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { CachedLogger } from 'pip-services3-components-node';
import { LogMessage } from 'pip-services3-components-node';
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
export declare class FluentdLogger extends CachedLogger implements IReferenceable, IOpenable {
    private _connectionResolver;
    private _reconnect;
    private _timeout;
    private _timer;
    private _client;
    /**
     * Creates a new instance of the logger.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId: string, callback: (err: any) => void): void;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId: string, callback: (err: any) => void): void;
    /**
     * Saves log messages from the cache.
     *
     * @param messages  a list with log messages
     * @param callback  callback function that receives error or null for success.
     */
    protected save(messages: LogMessage[], callback: (err: any) => void): void;
}
