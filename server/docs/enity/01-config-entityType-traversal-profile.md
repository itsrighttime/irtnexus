### **1 ENTITY_TYPES**

- Defines **what each entity is**, its capabilities, and characteristics.
- Think of it as a **catalog of all node types in your graph**.

**Key properties:**

| Property             | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `canHaveUsers`       | Can this entity have users assigned?               |
| `canOwnEntities`     | Can this entity be a parent to other entities?     |
| `billable`           | Can it be billed?                                  |
| `brandable`          | Can branding be applied here?                      |
| `complianceBoundary` | Does this entity act as a compliance boundary?     |
| `traversalEdges`     | Which edges are valid when traversing this entity? |

**Example:**
A `TEAM` can have users but cannot own other entities. A `REGION` cannot have users but defines a compliance boundary.

### **2 TRAVERSAL_PROFILES**

- Defines **how to traverse the graph** when evaluating specific operations (auth, billing, compliance, branding, UI).
- Think of it as **instructions for walking the entity graph**.

**Key properties:**

| Property           | Purpose                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `allowedEdgeTypes` | Which relationships/edges can be followed during this traversal.                             |
| `direction`        | Traverse "up" (toward parents) or "down" (toward children).                                  |
| `strategy`         | How to collect nodes (`collect_all`, `first_match`, `single_required`).                      |
| `entityFilter`     | Optional filter to include/exclude entities based on their capabilities (from ENTITY_TYPES). |

**Example:**

- Billing traversal only follows `BILLING_PARENT` edges and includes only entities where `billable === true`.
- Compliance traversal follows `DATA_RESIDENCY_PARENT` edges and stops at entities with `complianceBoundary === true`.

### **3 How They Relate**

The relationship is essentially **“rules applied to capabilities”**:

| Concept              | ENTITY_TYPES Role                                   | TRAVERSAL_PROFILES Role                                                       |
| -------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| Node type            | Defines what the node **is** and what it **can do** | Traversal uses these properties to decide if a node **participates**          |
| Edges                | Lists possible outgoing edges (`traversalEdges`)    | Traversal specifies which edges to **follow** for a specific operation        |
| Policies / Actions   | BILLING, BRANDING, AUTH, COMPLIANCE capabilities    | Traversal profiles use filters (`entityFilter`) to pick only compatible nodes |
| Direction & strategy | N/A (entity is passive)                             | Profiles define traversal logic: **up/down, BFS/DFS, first match, etc.**      |

**In short:**

- `ENTITY_TYPES` = “what exists in the graph”
- `TRAVERSAL_PROFILES` = “how we move through the graph and which nodes we care about”
- `TRAVERSAL_PROFILES` often references `ENTITY_TYPES` capabilities to **filter nodes dynamically**.
