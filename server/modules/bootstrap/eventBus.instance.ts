import { redisUrl } from "#configs";
import { EventBus } from "#packages/event-bus/";

const eventBus = new EventBus(redisUrl);

export { eventBus };
