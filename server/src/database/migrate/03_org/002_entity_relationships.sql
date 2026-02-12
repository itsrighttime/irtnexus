CREATE TABLE entity_relationships (
    id BINARY(16) PRIMARY KEY,
    from_entity_id BINARY(16) NOT NULL,
    to_entity_id BINARY(16) NOT NULL,
    relationship_type ENUM(
        'OWNS',
        'CONTROLS',
        'BELONGS_TO',
        'HAS_SUB_ENTITY',
        'BILLING_PARENT',
        'DATA_RESIDENCY_PARENT',
        'FEDERATES_WITH',
        'IMPERSONATES',
        'HAS_ROLE',
        'ROLE_APPLIES_TO'
    ) NOT NULL,
    constraints JSON,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_entity_id) REFERENCES entities(id),
    FOREIGN KEY (to_entity_id) REFERENCES entities(id),
    UNIQUE KEY uq_edge (from_entity_id, to_entity_id, relationship_type),
    INDEX idx_from (from_entity_id),
    INDEX idx_to (to_entity_id),
    INDEX idx_type (relationship_type)
);