### 1 What `T` is

In the declaration:

```ts
export class BaseRepository<T extends QueryResultRow> {}
```

* `T` is a **generic type parameter**.
* It allows the `BaseRepository` class to be **type-safe for different tables**.
* `extends QueryResultRow` means `T` **must** be an object type compatible with a row returned from a PostgreSQL query (i.e., a record where keys are column names and values are the corresponding types).


### 2 Why generics?

Without generics, repository methods like `create`, `update`, `findById`, etc., would have to return a generic object:

```ts
async create(record: any): Promise<any>
```

This loses **type safety**. With generics:

```ts
interface Project {
  id: number;
  name: string;
  status: string;
}

const projectRepo = new BaseRepository<Project>({ ... });
```

* Now, `create` knows it will return a `Project` object:

```ts
const project = await projectRepo.create({ name: "Alpha", status: "OPEN" }, ctx);
// project.id, project.name, project.status are all type-checked
```

* TypeScript will **catch errors** if you try to access a field that doesn’t exist or pass invalid data.


### 3 Example Usage

```ts
interface User {
  id: number;
  email: string;
  tenant_id: string;
}

const userRepo = new BaseRepository<User>({
  tableName: "users",
  versionTableName: "users_version",
});

// Safe: TypeScript knows `user` has `id` and `email`
const user = await userRepo.create({ email: "abc@xyz.com", tenant_id: "t1" }, ctx);

// Type Error: 'name' doesn't exist on User
// user.name = "John"; // Wrong
```


### 4 Summary

* `T` = **table-specific type for the repository**
* Ensures **type safety** for CRUD operations
* Must extend `QueryResultRow` because that's what `pg` returns for queries
* Allows a single repository class to work with **any table** while keeping TypeScript aware of the table structure.
