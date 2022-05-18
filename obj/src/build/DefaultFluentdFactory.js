"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFluentdFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const FluentdLogger_1 = require("../log/FluentdLogger");
/**
 * Creates Fluentd components by their descriptors.
 *
 * @see [[FluentdLogger]]
 */
class DefaultFluentdFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultFluentdFactory.FluentdLoggerDescriptor, FluentdLogger_1.FluentdLogger);
    }
}
exports.DefaultFluentdFactory = DefaultFluentdFactory;
DefaultFluentdFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "fluentd", "default", "1.0");
DefaultFluentdFactory.FluentdLoggerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "logger", "fluentd", "*", "1.0");
//# sourceMappingURL=DefaultFluentdFactory.js.map