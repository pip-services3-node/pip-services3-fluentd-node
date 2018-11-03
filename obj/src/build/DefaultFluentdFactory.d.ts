/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates Fluentd components by their descriptors.
 *
 * @see [[FluentdLogger]]
 */
export declare class DefaultFluentdFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly FluentdLoggerDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
