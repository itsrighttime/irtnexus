import { entityQuery } from "#queries";

import { translate } from "#translations";
import {
  generateBinaryUUID,
  HTTP_STATUS,
  RESPONSE,
  executeAction,
} from "#utils";
import { ACTION } from "#config";

const { insertEntity, getEntityById, getEntitiesByType } = entityQuery;

export const createEntity = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.ENTITY_CREATION, type: ACTION.TYPE.ENTITY },
    resource: {},
    handler: async () => {
      const { name, type, meta } = payload;
      const id = generateBinaryUUID();

      await entityQuery.insertEntity({ id, name, type, metadata: meta });

      return RESPONSE.struct(
        RESPONSE.status.SUCCESS,
        HTTP_STATUS.x2_OK,
        translate("entity.entity_created", { entity: name }),
        "00020",
        {}, // Data
      );
    },
  });
