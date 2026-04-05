import { EventBus } from "#packages/event-bus";
import { notificationConsumers } from "../notification/consumers";
// import { authConsumers } from "./authentication/consumers";
// import { communicationConsumers } from "./communication/consumers";

export const eventBusConsumerRegistry = (eventBus: EventBus) => {
  const allModules = [
    notificationConsumers,
    // authConsumers,
    // communicationConsumers,
  ];

  allModules.forEach((registerModuleConsumers) =>
    registerModuleConsumers(eventBus),
  );
};
