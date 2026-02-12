export default {
  entity: {
    entity_created: "{{entity}}, Created Successfully",
    entity_updated: "Entity Updated Successfully",
  },
  entity_rel: {
    err_cycle: "Adding this relationship would create a cycle",
    err_self_loop: "Cannot create self-loop",
    err_max_edge_out:
      "Maximum {{max}} Outgoing edges is allowed, Which you already achieved",
    err_max_edge_in:
      "Maximum {{max}} Incomming edges is allowed, Which you already achieved",
    err_target_entity: "Target (to) entity not found",
    err_source_entity: "Source (from) entity not found",
    err_relationship_exist: "Relationship already exist",
    err_rel_not_support: "This Relationship cannot be added from this entity",
    entity_rel_created: "Relationship added Successfully",
  },
};
